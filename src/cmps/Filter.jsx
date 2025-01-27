import { useState } from "react"

export function Filter({ filterBy, setFilterBy, type, selectOptions, expenseTypes }) {
    const [showMaxInv, setShowMaxInv] = useState(false)
    const [isSelect, setIsSelect] = useState(false)
    const { from, to, maxNum, sortBy, sortDir } = filterBy


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
            <span className="tag">אפשרויות סינון</span>
            <section className="search-input">
                <label htmlFor="txt">
                    <img src="https://res.cloudinary.com/dollaguij/image/upload/v1701785795/wednesday/ztavmltqyl9th2ndasir.svg" alt="" />
                </label>
                <input type="text" name="txt" id="txt" placeholder="חיפוש" onInput={setNewFilter} />
            </section>
            {/* <div className="max-inventory">
                <div className="inventory-checkbox">
                    <input type="checkbox" name="lowInventory" id="lowInventory" onChange={setLowInventory} />
                    <label htmlFor="lowInventory">מלאי נמוך</label>
                </div>
                <div className="inventory-checkbox">
                    <input type="checkbox" name="maxInventory" id="maxInventory" onChange={setMaxInventory} />
                    <label htmlFor="maxInventory">מלאי מקס'</label>
                </div>
                {showMaxInv && <input className="num-input" type="number" name="maxNum" value={maxNum} onInput={setNewFilter} />}
                {!showMaxInv && <input className="num-input" type="number" name="maxNum" value={maxNum} onInput={setNewFilter} step="10" disabled />}
            </div> */}
            <div className="type-filter">
                {expenseTypes.map(type =>
                    <span key={type} className={filterBy.selectedTypes.includes(type) ? 'selected' : ''} onClick={() => setExpenseTypes(type)}>{type}</span>
                )}
            </div>
            {/* {type === 'sales' && <div className="paid-options">
                <div className="paid-checkbox">
                    <input type="checkbox" name="true" id="paid" onChange={setPaid} />
                    <label htmlFor="paid">שולם</label>
                </div>
                <div className="paid-checkbox">
                    <input type="checkbox" name="partial" id="partial" onChange={setPaid} />
                    <label htmlFor="partial">שולם חלקית</label>
                </div>
                <div className="paid-checkbox">
                    <input type="checkbox" name="false" id="notPaid" onChange={setPaid} />
                    <label htmlFor="notPaid">לא שולם</label>
                </div>
            </div>} */}
            {selectOptions && <section className="sort">
                <button onClick={() => setIsSelect(!isSelect)}>
                    <span>{selectOptions.find(option => option.value === sortBy).title}</span>
                </button>
                {/* <button className="sortDir-btn" onClick={() => setNewFilter({ target: { name: 'sortDir', value: sortDir === 'up' ? 'down' : 'up' } })}>
                    <img className={`sortDir ${sortDir === 'up' ? 'up' : 'down'}`} src="https://res.cloudinary.com/dollaguij/image/upload/v1701785794/wednesday/bwudwrzkha2pdcy3ga7q.svg" alt="" />
                </button> */}
            </section>}
            {isSelect && <section className="select-modal">
                {selectOptions.map((option, idx) =>
                    <div key={idx} className={`select-option`}
                        onClick={() => setNewFilter({ target: { name: 'sortBy', value: option.value } })}><span>{option.title}</span>
                        {(filterBy.sortBy === option.value) &&
                            <img className={"details-svg-img"} src="https://res.cloudinary.com/dollaguij/image/upload/v1699194254/svg/checked_paj0fg.svg" alt="" />
                        }
                    </div>)}
            </section>}
        </section>
    )
}