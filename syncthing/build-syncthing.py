from __future__ import print_function

import os
import os.path
import platform
import subprocess
import sys
import re

class CreateBuild:

    module_dir = None
    project_dir = None
    # Use separate build dir so standalone ndk isn't deleted by `gradle clean`
    build_dir = None
    go_build_dir = None
    syncthing_dir = None
    min_sdk = None

    PLATFORM_DIRS = {
        'Windows': 'windows-x86_64',
        'Linux': 'linux-x86_64',
        'Darwin': 'darwin-x86_64',
    }

    # The values here must correspond with those in ../docker/prebuild.sh
    BUILD_TARGETS = [
        {
            'arch': 'arm',
            'goarch': 'arm',
            'jni_dir': 'armeabi',
            'cc': 'armv7a-linux-androideabi{}-clang',
        },
        {
            'arch': 'arm64',
            'goarch': 'arm64',
            'jni_dir': 'arm64-v8a',
            'cc': 'aarch64-linux-android{}-clang',
        },
        {
            'arch': 'x86',
            'goarch': '386',
            'jni_dir': 'x86',
            'cc': 'i686-linux-android{}-clang',
        },
        {
            'arch': 'x86_64',
            'goarch': 'amd64',
            'jni_dir': 'x86_64',
            'cc': 'x86_64-linux-android{}-clang',
        }
    ]


    def __init__(self):
        self.validate_platform()
        self.initialize_variables()
        self.fetch_tags()

    def initialize_variables(self):
        self.module_dir = os.path.dirname(os.path.realpath(__file__))
        self.project_dir = os.path.realpath(os.path.join(self.module_dir, '..'))
        # Use separate build dir so standalone ndk isn't deleted by `gradle clean`
        self.build_dir = os.path.join(self.module_dir, 'gobuild')
        self.go_build_dir = os.path.join(self.build_dir, 'go-packages')
        self.syncthing_dir = os.path.join(self.module_dir, 'syncthing')
        self.min_sdk = self.get_min_sdk()

        # Validates and sets the android environment variables
        self.android_ndk_root = self.get_android_ndk_root()
        self.android_home = self.get_android_home()
        self.ndk_version = self.get_ndk_version()


    def validate_platform(self):
        if platform.system() not in self.PLATFORM_DIRS:
            CreateBuild.fail(f'Unsupported python platform {platform.system()}. Supported platforms: {', '.join(self.PLATFORM_DIRS.keys())}')

    def fetch_tags(self):
        subprocess.check_call(['git', '-C', self.syncthing_dir, 'fetch', '--tags'])

    def get_android_ndk_root(self):
        android_ndk_root = os.environ.get('ANDROID_NDK_ROOT', '')
        if not android_ndk_root:
            CreateBuild.fail('ANDROID_NDK_ROOT environment variable must be defined')
        return android_ndk_root
    
    def get_android_home(self):
        android_home = os.environ.get('ANDROID_HOME', '')
        if not android_home:
            CreateBuild.fail('ANDROID_HOME environment variable must be defined')
        return android_home
    
    def get_ndk_version(self):
        ndk_version = os.environ.get('NDK_VERSION', '')
        if not ndk_version:
            ndk_versions = os.listdir(self.android_ndk_root)
            if len(ndk_versions):
                ndk_versions.sort()
                ndk_version = ndk_versions[0]
        else:
            CreateBuild.fail("NDK_VERSION has not been set, and ANDROID_NDK_ROOT doesn't have any folders.")            
        return ndk_version
    

    def get_min_sdk(self):
        gradle_project_info = subprocess.Popen(['./gradlew', 'app:dependencies'], cwd=f'{self.project_dir}/android', stdout=subprocess.PIPE) 
        min_sdk_line = subprocess.Popen(['grep', 'minSdk'], stdin=gradle_project_info.stdout, stdout=subprocess.PIPE)
        min_sdk_parsed = subprocess.run(['awk', "{print $3}"], stdin=min_sdk_line.stdout, stdout=subprocess.PIPE)
        min_sdk = re.sub(r'\x1b\[[0-?]*[ -/]*[@-~]', '', min_sdk_parsed.stdout.decode().strip())

        if not min_sdk:
            CreateBuild.fail("Cannot get minSdk from the gradle file.")
        print(f"Running with minSdk: {min_sdk}")     
        return min_sdk

    def fail(message, *args, **kwargs):
        print((message % args).format(**kwargs))
        sys.exit(1)

    def create_builds(self):
        for target in self.BUILD_TARGETS:
            self.create_build(target)
        print('All builds finished')

    def copy_compiled_binary_to_JNILIBS(self, jni_dir):
        # Create jniLibs folder if it doesn't exist (directory for storing prebuilt libs)
        target_dir = os.path.join(self.project_dir, 'android', 'app', 'src', 'main', 'jniLibs', jni_dir)
        if not os.path.isdir(target_dir):
            os.makedirs(target_dir)
        
        # Moves the syncthing build to the jniLibs dir
        target_artifact = os.path.join(target_dir, 'libsyncthing.so')
        if os.path.exists(target_artifact):
            os.unlink(target_artifact)
        os.rename(os.path.join(self.syncthing_dir, 'syncthing'), target_artifact)


    def create_build(self, target):
        print('Building syncthing for', target['arch'])

        environ = os.environ.copy()
        environ.update({'GO111MODULE': 'on', 'CGO_ENABLED': '1', 'GOPATH': self.module_dir, 'EXTRA_LDFLAGS': '-checklinkname=0',})

        subprocess.check_call(['go', 'version'], env=environ, cwd=self.syncthing_dir)
        subprocess.check_call(['go', 'run', 'build.go', 'version'], env=environ, cwd=self.syncthing_dir)
        
        cc = os.path.join(self.android_ndk_root, self.ndk_version, "toolchains", "llvm", "prebuilt", self.PLATFORM_DIRS[platform.system()], "bin", target['cc'].format(self.min_sdk))
        
        subprocess.check_call(['go', 'run', 'build.go', '-goos', 'android', '-goarch', target['goarch'], '-cc', cc, '-pkgdir', os.path.join(self.go_build_dir, target['goarch']), '-no-upgrade', 'build'], env=environ, cwd=self.syncthing_dir)

        self.copy_compiled_binary_to_JNILIBS(target['jni_dir'])

        print('Finished build for', target['arch'])


if __name__ == '__main__':
    builder = CreateBuild()
    builder.create_builds()