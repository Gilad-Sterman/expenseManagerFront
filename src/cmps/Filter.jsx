import { useState } from "react"
import { Search, Filter as FilterIcon, X, Check, ChevronDown } from "lucide-react"

export function Filter({ filterBy, setFilterBy, type, selectOptions, expenseTypes }) {
    const [showMaxInv, setShowMaxInv] = useState(false)
    const [isSelect, setIsSelect] = useState(false)
    const { from, to, maxNum, sortBy, sortDir } = filterBy
    const paymentTypes = [{ title: 'מזומן', value: 'cash' }, { title: 'אשראי', value: 'card' }, { title: 'העברה בנקאית', value: 'transfer' }, { title: 'אחר', value: 'other' },]

    function setNewFilter({ target }) {
        setIsSelect(false)
        const field = target.name
        const value = target.value
        filterBy[field] = (field === 'maxNum') ? +value : value
        const newFilter = JSON.parse(JSON.stringify(filterBy))
        setFilterBy(newFilter)
    }

    function setExpenseTypes(type) {
        let newTypes = []
        if (filterBy.selectedTypes.includes(type)) {
            newTypes = filterBy.selectedTypes.filter(t => type !== t)
        } else {
            newTypes = [...filterBy.selectedTypes, type]
        }
        filterBy.selectedTypes = newTypes
        const newFilter = JSON.parse(JSON.stringify(filterBy))
        setFilterBy(newFilter)
    }
    
    function setPaymentTypes(type) {
        let newTypes = []
        if (filterBy.selectedPaymentTypes.includes(type)) {
            newTypes = filterBy.selectedPaymentTypes.filter(t => type !== t)
        } else {
            newTypes = [...filterBy.selectedPaymentTypes, type]
        }
        filterBy.selectedPaymentTypes = newTypes
        const newFilter = JSON.parse(JSON.stringify(filterBy))
        setFilterBy(newFilter)
    }

    function setMaxInventory({ target }) {
        setShowMaxInv(target.checked)
        if (!target.checked) {
            filterBy.maxNum = ''
            const newFilter = JSON.parse(JSON.stringify(filterBy))
            setFilterBy(newFilter)
        } else {
            filterBy.maxNum = 10
            const newFilter = JSON.parse(JSON.stringify(filterBy))
            setFilterBy(newFilter)
        }
    }

    function setLowInventory({ target }) {
        filterBy.lowInventory = target.checked
        const newFilter = JSON.parse(JSON.stringify(filterBy))
        setFilterBy(newFilter)
    }

    function setPaid({ target }) {
        if (target.checked) {
            filterBy.paidOptions.push(target.name)
        } else {
            const optionIdx = filterBy.paidOptions.findIndex(option => option === target.name)
            filterBy.paidOptions.splice(optionIdx, 1)
        }
        const newFilter = JSON.parse(JSON.stringify(filterBy))
        setFilterBy(newFilter)
    }

    return (
        <section className="filter">
            {/* Search Section */}
            <div className="filter-section">
                <div className="section-header">
                    <FilterIcon size={18} />
                    <h4>חיפוש וסינון</h4>
                </div>
                
                <div className="search-input">
                    <div className="input-wrapper">
                        <Search size={20} className="search-icon" />
                        <input 
                            type="text" 
                            name="txt" 
                            id="txt" 
                            placeholder="חפש הוצאות..." 
                            onInput={setNewFilter}
                            className="search-field"
                        />
                    </div>
                </div>
            </div>

            {/* Payment Types Filter */}
            {paymentTypes.length > 0 && (
                <div className="filter-section">
                    <div className="section-header">
                        <h4>צורת תשלום</h4>
                        {filterBy.selectedPaymentTypes.length > 0 && (
                            <button 
                                className="clear-filter" 
                                onClick={() => {
                                    filterBy.selectedPaymentTypes = []
                                    const newFilter = JSON.parse(JSON.stringify(filterBy))
                                    setFilterBy(newFilter)
                                }}
                            >
                                <X size={14} />
                                נקה
                            </button>
                        )}
                    </div>
                    
                    <div className="filter-chips">
                        {paymentTypes.map(type => (
                            <button
                                key={type.value}
                                className={`filter-chip ${
                                    filterBy.selectedPaymentTypes.includes(type.value) ? 'selected' : ''
                                }`}
                                onClick={() => setPaymentTypes(type.value)}
                            >
                                {filterBy.selectedPaymentTypes.includes(type.value) && (
                                    <Check size={14} />
                                )}
                                {type.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Expense Types Filter */}
            {expenseTypes.length > 0 && (
                <div className="filter-section">
                    <div className="section-header">
                        <h4>סוג הוצאה</h4>
                        {filterBy.selectedTypes.length > 0 && (
                            <button 
                                className="clear-filter" 
                                onClick={() => {
                                    filterBy.selectedTypes = []
                                    const newFilter = JSON.parse(JSON.stringify(filterBy))
                                    setFilterBy(newFilter)
                                }}
                            >
                                <X size={14} />
                                נקה
                            </button>
                        )}
                    </div>
                    
                    <div className="filter-chips">
                        {expenseTypes.map(type => (
                            <button
                                key={type}
                                className={`filter-chip ${
                                    filterBy.selectedTypes.includes(type) ? 'selected' : ''
                                }`}
                                onClick={() => setExpenseTypes(type)}
                            >
                                {filterBy.selectedTypes.includes(type) && (
                                    <Check size={14} />
                                )}
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Sort Options */}
            {selectOptions && (
                <div className="filter-section">
                    <div className="section-header">
                        <h4>מיון</h4>
                    </div>
                    
                    <div className="sort-dropdown">
                        <button 
                            className="sort-button" 
                            onClick={() => setIsSelect(!isSelect)}
                        >
                            <span>{selectOptions.find(option => option.value === sortBy)?.title || 'בחר מיון'}</span>
                            <ChevronDown 
                                size={16} 
                                className={`chevron ${isSelect ? 'open' : ''}`} 
                            />
                        </button>
                        
                        {isSelect && (
                            <div className="sort-dropdown-menu">
                                {selectOptions.map((option, idx) => (
                                    <button
                                        key={idx}
                                        className={`sort-option ${
                                            filterBy.sortBy === option.value ? 'selected' : ''
                                        }`}
                                        onClick={() => setNewFilter({ target: { name: 'sortBy', value: option.value } })}
                                    >
                                        <span>{option.title}</span>
                                        {filterBy.sortBy === option.value && (
                                            <Check size={16} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Active Filters Summary */}
            {(filterBy.selectedPaymentTypes.length > 0 || filterBy.selectedTypes.length > 0) && (
                <div className="filter-summary">
                    <div className="summary-header">
                        <span>פילטרים פעילים ({filterBy.selectedPaymentTypes.length + filterBy.selectedTypes.length})</span>
                        <button 
                            className="clear-all-filters"
                            onClick={() => {
                                filterBy.selectedPaymentTypes = []
                                filterBy.selectedTypes = []
                                const newFilter = JSON.parse(JSON.stringify(filterBy))
                                setFilterBy(newFilter)
                            }}
                        >
                            <X size={14} />
                            נקה הכל
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}