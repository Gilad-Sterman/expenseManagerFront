import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { recurringExpenseService, FREQUENCIES } from "../services/recurring-expense.service"
import { utilService } from "../services/util.service"
import { expenseService } from "../services/expense.service"
import { updateUser } from "../store/user.actions"
import { Plus, Calendar, DollarSign, Tag, Trash2, Edit, ToggleLeft, ToggleRight, Clock } from "lucide-react"

export function RecurringExpenses() {
    const loggedUser = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()
    
    const [recurringExpenses, setRecurringExpenses] = useState([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingExpense, setEditingExpense] = useState(null)
    const [expenseTypes, setExpenseTypes] = useState([])
    
    // New recurring expense template
    const emptyRecurringExpense = {
        id: '',
        name: '',
        amount: '',
        type: '',
        pType: 'card',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        dayOfMonth: new Date().getDate(),
        desc: '',
        active: true
    }
    
    useEffect(() => {
        if (!loggedUser) {
            navigate('/login')
            return
        }
        
        loadRecurringExpenses()
        const types = expenseService.getExpenseTypes(loggedUser.expenses)
        setExpenseTypes(types)
    }, [loggedUser])
    
    function loadRecurringExpenses() {
        const expenses = recurringExpenseService.getRecurringExpenses(loggedUser)
        setRecurringExpenses(expenses)
    }
    
    async function handleAddRecurringExpense(newExpense) {
        try {
            newExpense.id = utilService.generateRandomId()
            const newRecurringExpenses = [...recurringExpenses, newExpense]
            await expenseService.updateRecurringExpenses(newRecurringExpenses, loggedUser._id)
            setShowAddForm(false)
            setRecurringExpenses(newRecurringExpenses)
        } catch (err) {
            console.error('Failed to add recurring expense:', err)
        }
    }
    
    async function handleUpdateRecurringExpense(updatedExpense) {
        try {
            // Update local state
            const updatedExpenses = recurringExpenses.map(expense => 
                expense.id === updatedExpense.id ? updatedExpense : expense
            )
            
            // Update in storage
            await expenseService.updateRecurringExpenses(updatedExpenses, loggedUser._id)
            setEditingExpense(null)
            setRecurringExpenses(updatedExpenses)
        } catch (err) {
            console.error('Failed to update recurring expense:', err)
        }
    }
    
    async function handleDeleteRecurringExpense(expenseId) {
        try {
            // Update local state
            const updatedExpenses = recurringExpenses.filter(expense => expense.id !== expenseId)
            
            // Update in storage
            await expenseService.updateRecurringExpenses(updatedExpenses, loggedUser._id)
            setRecurringExpenses(updatedExpenses)
        } catch (err) {
            console.error('Failed to delete recurring expense:', err)
        }
    }
    
    function toggleExpenseActive(expense) {
        const updatedExpense = { ...expense, active: !expense.active }
        handleUpdateRecurringExpense(updatedExpense)
    }
    
    function getNextOccurrences(expense) {
        return recurringExpenseService.getNextOccurrences(expense, 3)
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString)
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }
    
    function getFrequencyLabel(frequency) {
        const found = FREQUENCIES.find(f => f.value === frequency)
        return found ? found.label : frequency
    }
    
    return (
        <section className="recurring-expenses-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="header-content">
                    <div className="title-section">
                        <h1 className="page-title">הוצאות קבועות</h1>
                        <p className="page-subtitle">נהל את ההוצאות החוזרות שלך</p>
                    </div>
                    <button 
                        className="btn-primary add-expense-btn" 
                        onClick={() => setShowAddForm(true)}
                    >
                        <Plus size={20} />
                        הוספה  
                    </button>
                </div>
            </div>
            
            {/* Recurring Expenses List */}
            {recurringExpenses.length > 0 ? (
                <div className="recurring-expenses-grid">
                    {recurringExpenses.map(expense => (
                        <div key={expense.id} className={`recurring-expense-card ${!expense.active ? 'inactive' : ''}`}>
                            <div className="card-header">
                                <h3>{expense.name}</h3>
                                <div className="card-actions">
                                    <button 
                                        className="toggle-btn" 
                                        onClick={() => toggleExpenseActive(expense)}
                                        title={expense.active ? 'השבת' : 'הפעל'}
                                    >
                                        {expense.active ? 
                                            <ToggleRight size={20} className="active" /> : 
                                            <ToggleLeft size={20} />
                                        }
                                    </button>
                                    <button 
                                        className="edit-btn" 
                                        onClick={() => setEditingExpense(expense)}
                                        title="ערוך"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDeleteRecurringExpense(expense.id)}
                                        title="מחק"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="card-body">
                                <div className="expense-details">
                                    <div className="detail-item">
                                        <DollarSign size={16} />
                                        <span>{expense.amount} ₪</span>
                                    </div>
                                    <div className="detail-item">
                                        <Tag size={16} />
                                        <span>{expense.type}</span>
                                    </div>
                                    <div className="detail-item">
                                        <Clock size={16} />
                                        <span>{getFrequencyLabel(expense.frequency)}</span>
                                    </div>
                                </div>
                                
                                <div className="expense-description">
                                    <p>{expense.desc}</p>
                                </div>
                                
                                <div className="next-occurrences">
                                    <h4>התשלומים הבאים:</h4>
                                    <div className="occurrences-list">
                                        {getNextOccurrences(expense).map((date, idx) => (
                                            <div key={idx} className="occurrence-date">
                                                <Calendar size={14} />
                                                <span>{formatDate(date)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-content">
                        <div className="empty-icon">
                            <Clock size={48} />
                        </div>
                        <h3>אין הוצאות קבועות</h3>
                        <p>הוסף הוצאות קבועות כדי לעקוב אחר תשלומים חוזרים</p>
                        <button 
                            className="btn-primary" 
                            onClick={() => setShowAddForm(true)}
                        >
                            <Plus size={20} />
                            הוסף הוצאה קבועה ראשונה
                        </button>
                    </div>
                </div>
            )}
            
            {/* Add/Edit Form Modal */}
            {(showAddForm || editingExpense) && (
                <div className="modal-overlay" onClick={() => {
                    setShowAddForm(false)
                    setEditingExpense(null)
                }}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{editingExpense ? 'ערוך הוצאה קבועה' : 'הוסף הוצאה קבועה'}</h2>
                        <RecurringExpenseForm 
                            initialExpense={editingExpense || emptyRecurringExpense}
                            onSubmit={editingExpense ? handleUpdateRecurringExpense : handleAddRecurringExpense}
                            onCancel={() => {
                                setShowAddForm(false)
                                setEditingExpense(null)
                            }}
                            expenseTypes={expenseTypes}
                        />
                    </div>
                </div>
            )}
        </section>
    )
}

function RecurringExpenseForm({ initialExpense, onSubmit, onCancel, expenseTypes }) {
    const [expense, setExpense] = useState(initialExpense)
    
    function handleChange(e) {
        const { name, value, type } = e.target
        setExpense({
            ...expense,
            [name]: type === 'number' ? Number(value) : value
        })
    }
    
    function handleSubmit(e) {
        e.preventDefault()
        onSubmit(expense)
    }
    
    return (
        <form className="recurring-expense-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">שם ההוצאה</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={expense.name}
                    onChange={handleChange}
                    required
                    placeholder="לדוגמה: חשבון חשמל"
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="desc">תיאור</label>
                <input
                    type="text"
                    id="desc"
                    name="desc"
                    value={expense.desc}
                    onChange={handleChange}
                    placeholder="תיאור נוסף (אופציונלי)"
                />
            </div>
            
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="amount">סכום</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={expense.amount}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="type">קטגוריה</label>
                    <select
                        id="type"
                        name="type"
                        value={expense.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">בחר קטגוריה</option>
                        {expenseTypes.map((type, idx) => (
                            <option key={idx} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="frequency">תדירות</label>
                    <select
                        id="frequency"
                        name="frequency"
                        value={expense.frequency}
                        onChange={handleChange}
                        required
                    >
                        {FREQUENCIES.map((freq, idx) => (
                            <option key={idx} value={freq.value}>{freq.label}</option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group">
                    <label htmlFor="pType">אמצעי תשלום</label>
                    <select
                        id="pType"
                        name="pType"
                        value={expense.pType}
                        onChange={handleChange}
                        required
                    >
                        <option value="card">אשראי</option>
                        <option value="transfer">העברה בנקאית</option>
                        <option value="cash">מזומן</option>
                        <option value="other">אחר</option>
                    </select>
                </div>
            </div>
            
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="startDate">תאריך התחלה</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={expense.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="endDate">תאריך סיום (אופציונלי)</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={expense.endDate || ''}
                        onChange={handleChange}
                    />
                </div>
            </div>
            
            {expense.frequency === 'monthly' && (
                <div className="form-group">
                    <label htmlFor="dayOfMonth">יום בחודש</label>
                    <input
                        type="number"
                        id="dayOfMonth"
                        name="dayOfMonth"
                        value={expense.dayOfMonth}
                        onChange={handleChange}
                        min="1"
                        max="31"
                        required
                    />
                </div>
            )}
            
            <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onCancel}>
                    ביטול
                </button>
                <button type="submit" className="btn-primary">
                    {initialExpense.id ? 'עדכן' : 'הוסף'}
                </button>
            </div>
        </form>
    )
}
