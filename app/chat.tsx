import { Stack } from 'expo-router';
import { View } from 'react-native';
import ChatInterface from '../components/ChatInterface';

export default function ChatScreen() {
    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    title: 'CyberSafe Assistant',
                    headerStyle: { backgroundColor: '#fff' },
                    headerTintColor: '#3b5998',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            />
            <ChatInterface />
        </View>
    );
}
