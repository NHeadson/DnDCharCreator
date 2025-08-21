# Duplicate Detection Test Plan

## Test Scenario: Multi-Stage Equipment Selection Conflicts

### Test Case 1: Artisan Tools Conflict
**Objective**: Ensure individual artisan tool selections conflict with category-based artisan tool selections

**Steps to Test**:
1. Create a character that would have artisan tool choices (e.g., Monk with Folk Hero background)
2. Go to Page 4 (Equipment & Gear)
3. Select "Smith's tools" from an individual artisan tool choice
4. Navigate to a different equipment choice that offers "Artisan's Tools or Musical Instrument"
5. Try to select "Artisan's Tools" category - it should be disabled/show as error

**Expected Behavior**: 
- Smith's tools should show up in console logs with our debug messages
- The "Artisan's Tools" category option should be disabled (red color, tonal variant)
- Console should show: `Found conflict with multiStage category: [choiceType] has selected Artisan's Tools`

### Test Case 2: Musical Instrument Conflict
**Objective**: Ensure individual musical instrument selections conflict with category-based musical instrument selections

**Steps to Test**:
1. Select "Lute" from an individual musical instrument choice
2. Navigate to a different choice offering "Artisan's Tools or Musical Instrument"
3. Try to select "Musical Instrument" category - it should be disabled

### Test Case 3: Reverse Conflict
**Objective**: Ensure category selections disable individual items

**Steps to Test**:
1. Select "Artisan's Tools" category from a multi-stage choice
2. Complete the selection by choosing a specific tool (e.g., "Smith's tools")
3. Navigate to other equipment choices that offer individual artisan tools
4. All individual artisan tools should be disabled

## Debug Console Messages to Look For

When testing with Smith's tools, you should see:
```
🔍 Checking duplicates for "Smith's tools" (normalized: "smith's tools") in choiceType: "[currentType]"
Current equipmentChoices: {...}
Current multiStageChoices: {...}
```

And one of these conflict messages:
- `Found duplicate in equipmentChoices: [choiceType]`
- `Found conflict with multiStage category: [choiceType] has selected Artisan's Tools`
- `Found duplicate in multiStageChoices: [choiceType]`
- `Found duplicate in allTools`
- `No duplicates found for "Smith's tools"` (if no conflicts)

## Character Setup Recommendations

**Recommended Test Character**:
- **Class**: Monk (gets artisan tool choices)
- **Background**: Folk Hero (gets artisan tool proficiencies)
- This combination should create multiple equipment choices with potential conflicts

## Visual Indicators

**When Duplicate Detected**:
- Color: `error` (red)
- Variant: `tonal`
- Disabled: `true`
- Clickable: `false`

**When Not Selected**:
- Color: `default`
- Variant: `outlined`
- Disabled: `false`
- Clickable: `true`

**When Selected**:
- Color: `success` (green)
- Variant: `elevated`
