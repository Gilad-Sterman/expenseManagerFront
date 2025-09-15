export const recurringExpenseService = {
    getRecurringExpenses,
    addRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
    generateExpensesFromRecurring,
    getNextOccurrences
}

// Frequency options
export const FREQUENCIES = [
    { value: 'daily', label: 'יומי' },
    { value: 'weekly', label: 'שבועי' },
    { value: 'monthly', label: 'חודשי' },
    { value: 'yearly', label: 'שנתי' }
]

// Get all recurring expenses
function getRecurringExpenses(user) {
    return user.recurringExpenses || []
}

// Add a new recurring expense
async function addRecurringExpense(recurringExpense, user) {
    // Implementation will depend on your backend structure
    // This is a placeholder for the API call
    try {
        // Add to user's recurring expenses
        const updatedUser = {
            ...user,
            recurringExpenses: [...(user.recurringExpenses || []), recurringExpense]
        }
        
        // Here you would make an API call to update the user
        // For now, we'll return the updated user object
        return updatedUser
    } catch (err) {
        console.error('Failed to add recurring expense:', err)
        throw err
    }
}

// Update an existing recurring expense
async function updateRecurringExpense(updatedRecurringExpense, user) {
    try {
        const updatedRecurringExpenses = (user.recurringExpenses || []).map(expense => 
            expense.id === updatedRecurringExpense.id ? updatedRecurringExpense : expense
        )
        
        const updatedUser = {
            ...user,
            recurringExpenses: updatedRecurringExpenses
        }
        
        // Here you would make an API call to update the user
        return updatedUser
    } catch (err) {
        console.error('Failed to update recurring expense:', err)
        throw err
    }
}

// Delete a recurring expense
async function deleteRecurringExpense(recurringExpenseId, user) {
    try {
        const updatedRecurringExpenses = (user.recurringExpenses || []).filter(
            expense => expense.id !== recurringExpenseId
        )
        
        const updatedUser = {
            ...user,
            recurringExpenses: updatedRecurringExpenses
        }
        
        // Here you would make an API call to update the user
        return updatedUser
    } catch (err) {
        console.error('Failed to delete recurring expense:', err)
        throw err
    }
}

// Generate actual expenses from recurring templates
function generateExpensesFromRecurring(recurringExpenses, existingExpenses = [], currentDate = new Date()) {
    const newExpenses = []
    const updatedRecurringExpenses = JSON.parse(JSON.stringify(recurringExpenses))
    
    updatedRecurringExpenses.forEach(recurringExpense => {
        if (!recurringExpense.active) return
        
        // Set start date as the initial reference point if no expenses have been generated yet
        let lastGenerated = recurringExpense.lastGenerated 
            ? new Date(recurringExpense.lastGenerated) 
            : new Date(recurringExpense.startDate)
        
        // Keep generating expenses until we're caught up to current date
        let nextDate = getNextOccurrenceDate(lastGenerated, recurringExpense.frequency, recurringExpense)
        
        while (nextDate <= currentDate) {
            // Format the date for comparison with existing expenses
            const formattedDate = formatDate(nextDate)
            
            // Check if this expense already exists (avoid duplicates)
            const alreadyExists = existingExpenses.some(expense => 
                expense.isRecurring && 
                expense.recurringId === recurringExpense.id && 
                expense.date === formattedDate
            )
            
            // Only create a new expense if it doesn't already exist
            if (!alreadyExists) {
                // Create a new expense from the template
                const newExpense = {
                    id: generateId(),
                    date: formattedDate,
                    desc: recurringExpense.desc || recurringExpense.name, // Use name as fallback
                    paid: recurringExpense.amount,
                    type: recurringExpense.type,
                    pType: recurringExpense.pType,
                    isRecurring: true,
                    recurringId: recurringExpense.id
                }
                
                newExpenses.push(newExpense)
            }
            
            // Update the last generated date and move to next occurrence
            recurringExpense.lastGenerated = formattedDate
            lastGenerated = nextDate
            nextDate = getNextOccurrenceDate(lastGenerated, recurringExpense.frequency, recurringExpense)
            
            // Safety check: if the next date is the same as the current one, break to avoid infinite loop
            if (isSameDay(nextDate, lastGenerated)) break
        }
    })
    
    return {
        newExpenses,
        updatedRecurringExpenses
    }
}

// Get the next N occurrences of a recurring expense
function getNextOccurrences(recurringExpense, count = 3, startDate = new Date()) {
    const occurrences = []
    
    // Special case for monthly recurring expenses with a specific day of month
    if (recurringExpense.frequency === 'monthly' && recurringExpense.dayOfMonth) {
        // Get the current month and year
        const currentYear = startDate.getFullYear()
        const currentMonth = startDate.getMonth()
        
        // Create a date for the specified day in the current month
        const thisMonthDate = new Date(currentYear, currentMonth, recurringExpense.dayOfMonth)
        
        // If the day hasn't passed yet this month and is after the start date, include it
        if (thisMonthDate > startDate && 
            thisMonthDate > new Date(recurringExpense.startDate) && 
            thisMonthDate.getMonth() === currentMonth) {
            occurrences.push(new Date(thisMonthDate))
        }
        
        // Generate the remaining occurrences
        let nextDate = new Date(thisMonthDate)
        
        // If we already added the current month or it's not valid, start from next month
        if (occurrences.length === 0 || thisMonthDate <= startDate) {
            nextDate.setMonth(nextDate.getMonth() + 1)
            occurrences.push(new Date(nextDate))
        }
        
        // Generate remaining occurrences
        for (let i = occurrences.length; i < count; i++) {
            nextDate = new Date(nextDate)
            nextDate.setMonth(nextDate.getMonth() + 1)
            occurrences.push(new Date(nextDate))
        }
    } else {
        // For non-monthly or non-day-specific recurrences, use the original logic
        let currentDate = new Date(startDate)
        
        for (let i = 0; i < count; i++) {
            currentDate = getNextOccurrenceDate(currentDate, recurringExpense.frequency, recurringExpense)
            occurrences.push(new Date(currentDate))
        }
    }
    
    return occurrences
}

// Helper functions
function getNextOccurrenceDate(fromDate, frequency, recurringExpense) {
    const date = new Date(fromDate)
    
    switch (frequency) {
        case 'daily':
            date.setDate(date.getDate() + 1)
            break
        case 'weekly':
            date.setDate(date.getDate() + 7)
            break
        case 'monthly':
            const dayOfMonth = recurringExpense.dayOfMonth || date.getDate()
            date.setMonth(date.getMonth() + 1)
            // Handle month length differences
            const monthLength = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
            date.setDate(Math.min(dayOfMonth, monthLength))
            break
        case 'yearly':
            date.setFullYear(date.getFullYear() + 1)
            break
    }
    
    return date
}

function formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
}

function generateId() {
    return 'rec_' + Math.random().toString(36).substr(2, 9)
}
