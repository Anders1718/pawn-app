import React from 'react'
import { StyleSheet, View } from 'react-native'
import SectionTitle from './SectionTitle'
import Chip from './Chip'
import theme from '../theme'

// Wrapping grid of Chips used by the option groups on the case screen.
// `renderChip(item, index)` returns the Chip for each option; `onAdd` appends
// a dashed "+" chip.
export default function OptionGrid({ title, icon, subtitle, items = [], renderChip, onAdd, stretch, right }) {
    return (
        <View>
            {title ? <SectionTitle title={title} subtitle={subtitle} icon={icon} right={right} /> : null}
            <View style={styles.grid}>
                {items.map((item, index) => (
                    <View key={item.number ?? item.value ?? index} style={stretch ? styles.stretch : null}>
                        {renderChip(item, index)}
                    </View>
                ))}
                {onAdd ? <Chip icon="add" size="lg" onPress={onAdd} style={styles.add} /> : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    stretch: { flexGrow: 1, flexBasis: 0 },
    add: { borderStyle: 'dashed', borderColor: theme.colors.borderStrong, backgroundColor: 'transparent', minWidth: 56 },
})
