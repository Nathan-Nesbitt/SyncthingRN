import SyncthingAPI from '@/utils/syncthing/api/SyncthingAPI';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Settings() {
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConfig = async () => {
        try {
            const api = new SyncthingAPI("foobar");
            const configData = await api.getConfig();
            setConfig(configData);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch config: ' + (err as Error).message);
            setLoading(false);
        }
        };

        fetchConfig();
    }, []);

    if (loading) {
        return (
        <View style={styles.container}>
            <Text>Loading settings...</Text>
        </View>
        );
    }

    if (error) {
        return (
        <View style={styles.container}>
            <Text style={styles.error}>{error}</Text>
        </View>
        );
    }

    if (!config) {
        return (
        <View style={styles.container}>
            <Text>No config data</Text>
        </View>
        );
    }

    const handleSave = async () => {
        try {
        const api = new SyncthingAPI("foobar");
        await api.putConfig(config);
        alert('Config saved successfully!');
        } catch (err) {
        alert('Failed to save config: ' + (err as Error).message);
        }
    };
    
    return (
        <ScrollView style={styles.container}>            
            {/* GUI Settings */}
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>GUI Settings</Text>
            <Text style={styles.label}>GUI Address</Text>
            <TextInput
                style={styles.input}
                value={config.gui?.address || ''}
                onChangeText={(text) => setConfig({...config, gui: {...config.gui, address: text}})}
                placeholder="GUI Address"
            />
            <Text style={styles.label}>GUI Password</Text>
            <TextInput
                style={styles.input}
                value={config.gui?.password || ''}
                onChangeText={(text) => setConfig({...config, gui: {...config.gui, password: text}})}
                placeholder="GUI Password"
            />
            <Text style={styles.label}>API Key</Text>
            <TextInput
                style={styles.input}
                value={config.gui?.apiKey || ''}
                onChangeText={(text) => setConfig({...config, gui: {...config.gui, apiKey: text}})}
                placeholder="API Key"
            />
            </View>

            {/* Options Settings */}
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>Options</Text>
            <Text style={styles.label}>Listen Addresses (comma separated)</Text>
            <TextInput
                style={styles.input}
                value={config.options?.listenAddresses?.join(', ') || ''}
                onChangeText={(text) => setConfig({...config, options: {...config.options, listenAddresses: text.split(',').map(s => s.trim())}})}
                placeholder="Listen Addresses (comma separated)"
            />
            <Text style={styles.label}>Max Send Kbps</Text>
            <TextInput
                style={styles.input}
                value={config.options?.maxSendKbps?.toString() || ''}
                onChangeText={(text) => setConfig({...config, options: {...config.options, maxSendKbps: parseInt(text) || 0}})}
                placeholder="Max Send Kbps"
                keyboardType="numeric"
            />
            <Text style={styles.label}>Max Recv Kbps</Text>
            <TextInput
                style={styles.input}
                value={config.options?.maxRecvKbps?.toString() || ''}
                onChangeText={(text) => setConfig({...config, options: {...config.options, maxRecvKbps: parseInt(text) || 0}})}
                placeholder="Max Recv Kbps"
                keyboardType="numeric"
            />
            </View>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
            <Button title="Save Config" onPress={handleSave} />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});