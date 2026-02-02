import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    initiallyExpanded?: boolean;
}

export default function AccordionItem({ title, children, initiallyExpanded = false }: AccordionItemProps) {
    const [expanded, setExpanded] = useState(initiallyExpanded);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View style={[styles.container, expanded && styles.expandedContainer]}>
            <TouchableOpacity style={styles.header} onPress={toggleExpand} activeOpacity={0.7}>
                <Text style={[styles.title, expanded && styles.expandedTitle]}>{title}</Text>
                <View style={[styles.iconContainer, expanded && styles.expandedIconContainer]}>
                    <Feather
                        name={expanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={expanded ? '#FFF' : Colors.light.primary}
                    />
                </View>
            </TouchableOpacity>
            {expanded && (
                <View style={styles.content}>
                    {children}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EFEFEF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    expandedContainer: {
        borderColor: Colors.light.primary,
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        flex: 1,
        marginRight: 10,
        lineHeight: 24,
    },
    expandedTitle: {
        color: Colors.light.primary,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandedIconContainer: {
        backgroundColor: Colors.light.primary,
    },
    content: {
        padding: 20,
        paddingTop: 0,
        backgroundColor: '#FFF',
    }
});
