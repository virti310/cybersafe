import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Colors } from '../constants/theme';

const { width } = Dimensions.get('window');

interface SlideData {
    id: number;
    title: string;
    description: string;
    backgroundColor: string;
}

const SLIDE_INTERVAL = 3000; // 3 seconds

interface TextSliderProps {
    data: SlideData[];
}

export default function TextSlider({ data }: TextSliderProps) {
    const [activeSlide, setActiveSlide] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            let nextSlide = activeSlide + 1;
            if (nextSlide >= data.length) {
                nextSlide = 0;
            }

            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({
                    x: nextSlide * (width - 48), // Adjust for padding (24 * 2)
                    animated: true,
                });
                setActiveSlide(nextSlide);
            }
        }, SLIDE_INTERVAL);

        return () => clearInterval(interval);
    }, [activeSlide, data.length]);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slide = Math.ceil(event.nativeEvent.contentOffset.x / (width - 48));
        if (slide !== activeSlide && slide >= 0 && slide < data.length) {
            setActiveSlide(slide);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={width - 48} // Width of one slide
                contentContainerStyle={styles.scrollContent}
            >
                {data.map((item, index) => (
                    <View key={item.id} style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.pagination}>
                {data.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === activeSlide ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    scrollContent: {
        // paddingHorizontal: 24, // Handled by parent container padding usually, but here we want slides to fit full width minus parent padding
    },
    slide: {
        width: width - 48, // Parent container padding is 24 on each side, so 48 total
        height: 160,
        borderRadius: 16,
        padding: 20,
        justifyContent: 'center',
        marginRight: 0, // No margin right, we snap to interval
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 20,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: Colors.light.primary,
        width: 20,
    },
    inactiveDot: {
        backgroundColor: '#D1D5DB', // Gray-300
    },
});
