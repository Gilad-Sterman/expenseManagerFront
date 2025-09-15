export const suggestionService = {
    getSuggestions,
    getDescriptionSuggestions,
    getAmountSuggestions,
    getTypeSuggestions,
    getPaymentTypeSuggestions
}

/**
 * Get all suggestions for a new expense based on user's expense history
 * @param {Object} user - User object containing expenses array
 * @param {String} partialDesc - Partial description to match against (optional)
 * @returns {Object} Object containing suggestions for different fields
 */
function getSuggestions(user, partialDesc = '') {
    return {
        descriptions: getDescriptionSuggestions(user, partialDesc),
        amounts: getAmountSuggestions(user, partialDesc),
        types: getTypeSuggestions(user, partialDesc),
        paymentTypes: getPaymentTypeSuggestions(user, partialDesc)
    }
}

/**
 * Get description suggestions based on partial input
 * @param {Object} user - User object containing expenses array
 * @param {String} partialDesc - Partial description to match against
 * @returns {Array} Array of description suggestions
 */
function getDescriptionSuggestions(user, partialDesc = '') {
    if (!user?.expenses || !user.expenses.length) return []
    
    // Get all unique descriptions
    const descriptions = [...new Set(user.expenses.map(exp => exp.desc))]
    
    // Filter by partial match if provided
    const filteredDescriptions = partialDesc 
        ? descriptions.filter(desc => 
            desc.toLowerCase().includes(partialDesc.toLowerCase()))
        : descriptions
    
    // Sort by frequency (most common first)
    const descriptionCounts = user.expenses.reduce((acc, expense) => {
        acc[expense.desc] = (acc[expense.desc] || 0) + 1
        return acc
    }, {})
    
    return filteredDescriptions
        .sort((a, b) => descriptionCounts[b] - descriptionCounts[a])
        .slice(0, 5) // Limit to top 5 suggestions
}

/**
 * Get amount suggestions based on description
 * @param {Object} user - User object containing expenses array
 * @param {String} description - Expense description
 * @returns {Array} Array of amount suggestions
 */
function getAmountSuggestions(user, description = '') {
    if (!user?.expenses || !user.expenses.length) return []
    
    // If description is provided, filter expenses by matching description
    const relevantExpenses = description
        ? user.expenses.filter(exp => exp.desc.toLowerCase() === description.toLowerCase())
        : user.expenses
    
    // Get unique amounts
    const amounts = [...new Set(relevantExpenses.map(exp => exp.paid))]
    
    // Sort by frequency
    const amountCounts = relevantExpenses.reduce((acc, expense) => {
        acc[expense.paid] = (acc[expense.paid] || 0) + 1
        return acc
    }, {})
    
    return amounts
        .sort((a, b) => amountCounts[b] - amountCounts[a])
        .slice(0, 3) // Limit to top 3 suggestions
}

/**
 * Get type suggestions based on description
 * @param {Object} user - User object containing expenses array
 * @param {String} description - Expense description
 * @returns {Array} Array of type suggestions
 */
function getTypeSuggestions(user, description = '') {
    if (!user?.expenses || !user.expenses.length) return []
    
    // If description is provided, filter expenses by matching description
    const relevantExpenses = description
        ? user.expenses.filter(exp => exp.desc.toLowerCase() === description.toLowerCase())
        : user.expenses
    
    // Get unique types
    const types = [...new Set(relevantExpenses.map(exp => exp.type))]
    
    // Sort by frequency
    const typeCounts = relevantExpenses.reduce((acc, expense) => {
        acc[expense.type] = (acc[expense.type] || 0) + 1
        return acc
    }, {})
    
    return types
        .sort((a, b) => typeCounts[b] - typeCounts[a])
        .slice(0, 3) // Limit to top 3 suggestions
}

/**
 * Get payment type suggestions based on description
 * @param {Object} user - User object containing expenses array
 * @param {String} description - Expense description
 * @returns {Array} Array of payment type suggestions
 */
function getPaymentTypeSuggestions(user, description = '') {
    if (!user?.expenses || !user.expenses.length) return []
    
    // If description is provided, filter expenses by matching description
    const relevantExpenses = description
        ? user.expenses.filter(exp => exp.desc.toLowerCase() === description.toLowerCase())
        : user.expenses
    
    // Get unique payment types
    const paymentTypes = [...new Set(relevantExpenses.map(exp => exp.pType))]
    
    // Sort by frequency
    const paymentTypeCounts = relevantExpenses.reduce((acc, expense) => {
        acc[expense.pType] = (acc[expense.pType] || 0) + 1
        return acc
    }, {})
    
    return paymentTypes
        .sort((a, b) => paymentTypeCounts[b] - paymentTypeCounts[a])
}
