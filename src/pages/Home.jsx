import { useSelector } from "react-redux"
import { utilService } from "../services/util.service"
import { useEffect, useState } from "react"
import { months } from "../services/expense.service"
import { MySelect } from "../cmps/MySelect"
import { NavLink, useNavigate } from "react-router-dom"
import { Chart } from "../cmps/Chart"
import { useSwipeable } from "react-swipeable";
import { BarChart2, LineChart, ListPlus, Plus, HomeIcon, BarChart3, TrendingUp, TrendingDown } from "lucide-react"

export function Home() {
    const loggedUser = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()
    const [bar1Data, setBar1Data] = useState(null)
    const [bar2Data, setBar2Data] = useState(null)
    const [bar3Data, setBar3Data] = useState(null)
    const [bar4Data, setBar4Data] = useState(null)
    const [eByType, setEByType] = useState(null)
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [currentChart, setCurrentChart] = useState("Doughnut")
    const [selectedTab, setSelectedTab] = useState("Total")
    const [totalsByMonth, setTotalsByMonth] = useState(0)
    const [barLine, setBarLine] = useState('Bar')
    useEffect(() => {
        if (!loggedUser) {
            navigate('/login')
        } else {
            getData()
        }
    }, [loggedUser, navigate])

    useEffect(() => {
        if (loggedUser) {
            getData()
        }
    }, [month, selectedTab, loggedUser])


    function getData() {
        const doughnutData = utilService.getDataFromUser(loggedUser, month)
        const myBar1Data = utilService.getBar1Data(loggedUser, selectedTab)
        const myBar2Data = utilService.getBar2Data(loggedUser, month)
        const myBar3Data = utilService.getBar3Data(loggedUser, selectedTab)
        const myBar4Data = utilService.getBar4Data(loggedUser, month)
        const totals = utilService.getTotalsForMonth(loggedUser.expenses, month)

        setBar1Data(myBar1Data)
        setBar2Data(myBar2Data)
        setBar3Data(myBar3Data)
        setBar4Data(myBar4Data)
        setEByType(doughnutData)
        setTotalsByMonth(totals)
    }

    const greeting = utilService.getGreeting()

    const handlers = useSwipeable({
        onSwipedLeft: () => currentChart === 'Doughnut' ? setCurrentChart("Bar1") : currentChart === 'Bar1' ? setCurrentChart("Bar2") : setCurrentChart("Doughnut"),
        onSwipedRight: () => currentChart === 'Doughnut' ? setCurrentChart("Bar2") : currentChart === 'Bar2' ? setCurrentChart("Bar1") : setCurrentChart("Doughnut"),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true, // Allow swiping with a mouse as well
    })

    const handleTabClick = (tab) => {
        setSelectedTab(tab)
    }

    // Get current year
    const year = new Date().getFullYear()

    // Get current date to compare same period
    const today = new Date()
    const currentDay = today.getDate()
    const currentYear = today.getFullYear()
    
    // Calculate totals for current month up to today's date using the utility function
    const previousMonth = month === 1 ? 12 : month - 1
    const previousYear = month === 1 ? year - 1 : year
    
    // Use the new utility function for more accurate date-based comparisons
    const currentMonthTotal = utilService.getExpensesUpToDay(loggedUser?.expenses || [], month, year, currentDay)
    const previousMonthTotal = utilService.getExpensesUpToDay(loggedUser?.expenses || [], previousMonth, previousYear, currentDay)
    
    // Get full month totals for budget calculations
    const fullCurrentMonthTotal = loggedUser?.expenses?.reduce((acc, expense) => {
        const expenseDate = new Date(expense.date)
        const expenseMonth = expenseDate.getMonth() + 1
        const expenseYear = expenseDate.getFullYear()
        
        if (expenseMonth === month && expenseYear === year) {
            return acc + expense.paid
        }
        return acc
    }, 0) || 0
    

    // Calculate month-over-month percentage change (same period comparison)
    const monthOverMonthChange = previousMonthTotal > 0
        ? Math.round(((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100)
        : currentMonthTotal > 0 ? 100 : 0

    // Calculate average monthly spending (last 6 months)
    const last6MonthsTotal = loggedUser?.expenses?.reduce((acc, expense) => {
        const expenseDate = new Date(expense.date)
        const expenseMonth = expenseDate.getMonth()
        const expenseYear = expenseDate.getFullYear()

        // Calculate if expense is within last 6 months
        const currentDate = new Date(year, month - 1)
        const expenseMonthDate = new Date(expenseYear, expenseMonth)
        const monthsDiff = (currentDate.getFullYear() - expenseMonthDate.getFullYear()) * 12 +
            (currentDate.getMonth() - expenseMonthDate.getMonth())

        if (monthsDiff >= 0 && monthsDiff < 6) {
            return acc + expense.paid
        }
        return acc
    }, 0) || 0

    const averageMonthlySpending = Math.round(last6MonthsTotal / 6)

    // Dynamic budget calculation based on average spending + 10% buffer
    const monthlyBudget = Math.max(averageMonthlySpending * 1.1, 3000) // Minimum 3000₪ budget
    
    // Calculate day-proportional budget
    // Get days in current month
    const daysInMonth = new Date(year, month, 0).getDate()
    
    // Calculate budget that should be used up to today (proportional to days passed)
    const dayProportionalBudget = Math.round((currentDay / daysInMonth) * monthlyBudget)
    
    // Calculate remaining budget based on total monthly budget
    const remainingBudget = Math.max(monthlyBudget - fullCurrentMonthTotal, 0)
    
    // Calculate budget used as percentage of the full monthly budget
    const budgetUsed = Math.round((fullCurrentMonthTotal / monthlyBudget) * 100)
    
    
    // Format comparison date for display
    const comparisonDate = new Date(previousYear, previousMonth - 1, currentDay)
    const formattedComparisonDate = `${currentDay}/${previousMonth}/${previousYear}`

    const totalExpenses = loggedUser?.expenses?.reduce((acc, expense) => acc + expense.paid, 0) || 0

    // Update the state with current month total
    useEffect(() => {
        setTotalsByMonth(currentMonthTotal)
    }, [currentMonthTotal])

    return (
        <div className="home-page" {...handlers}>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">שלום {loggedUser?.username}, ברוך הבא!</h1>
                    <p className="hero-subtitle">הנה סקירת המצב הכספי שלך לחודש זה</p>
                </div>
            </section>

            {loggedUser?.expenses.length === 0 ? (
                /* Empty State */
                <section className="empty-state">
                    <div className="empty-state-card">
                        <div className="empty-state-icon">
                            <ListPlus size={48} />
                        </div>
                        <h3 className="empty-state-title">אין הוצאות עדיין</h3>
                        <p>התחל לעקוב אחר הכספים שלך על ידי הוספת ההוצאה הראשונה</p>
                        <NavLink to={'/expenses'} className="empty-state-btn">
                            <Plus size={20} />
                            הוסף את ההוצאה הראשונה
                        </NavLink>
                    </div>
                </section>
            ) : (
                <>
                    {/* Financial Overview Cards */}
                    <section className="overview-cards">
                        <div className="overview-card total-expenses">
                            <div className="card-header">
                                <h3>סך ההוצאות</h3>
                                <div className="card-icon expenses">
                                    <ListPlus size={24} />
                                </div>
                            </div>
                            <div className="card-value">
                                <span className="amount">{currentMonthTotal.toLocaleString()}</span>
                                <span className="currency">₪</span>
                            </div>
                            <div className={`card-trend ${monthOverMonthChange >= 0 ? 'negative' : 'positive'}`}>
                                <span className="trend-text">
                                    {monthOverMonthChange >= 0 ? '+' : ''}{monthOverMonthChange}% מהחודש הקודם
                                </span>
                            </div>
                            <div className="card-comparison">
                                <span className="comparison-text">
                                    השוואה ל-{formattedComparisonDate}: {previousMonthTotal.toLocaleString()}₪
                                </span>
                            </div>
                        </div>

                        <div className="overview-card budget-card">
                            <div className="card-header">
                                <h3>תקציב חודשי</h3>
                                <div className="card-icon budget">
                                    <BarChart3 size={24} />
                                </div>
                            </div>
                            <div className="card-value">
                                <span className="amount">{Math.round(monthlyBudget).toLocaleString()}</span>
                                <span className="currency">₪</span>
                            </div>
                            <div className="card-progress">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${Math.min(budgetUsed, 100)}%` }}></div>
                                </div>
                                <span className="progress-text">{budgetUsed}% נוצל ({fullCurrentMonthTotal.toLocaleString()}₪)</span>
                            </div>
                        </div>

                        <div className="overview-card savings-card">
                            <div className="card-header">
                                <h3>תקציב נותר</h3>
                                <div className="card-icon savings">
                                    <HomeIcon size={24} />
                                </div>
                            </div>
                            <div className="card-value">
                                <span className="amount">{Math.round(remainingBudget).toLocaleString()}</span>
                                <span className="currency">₪</span>
                            </div>
                            <div className={`card-trend ${remainingBudget > monthlyBudget * 0.3 ? 'positive' : 'warning'}`}>
                                <span className="trend-text">
                                    {remainingBudget > 0
                                        ? `${Math.round((remainingBudget / monthlyBudget) * 100)}% מהתקציב נותר`
                                        : 'חריגה מהתקציב!'
                                    }
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Controls Section */}
                    <section className="controls-section">
                        <div className="controls-card">
                            <div className="month-selector">
                                <label>בחר חודש:</label>
                                <MySelect options={months} selected={month} setSelected={setMonth} />
                            </div>

                            {(currentChart === "Bar1") && (
                                <div className="chart-type-selector">
                                    <label>סוג תרשים:</label>
                                    <div className="chart-buttons">
                                        <button
                                            className={`chart-btn ${barLine === 'Bar' ? 'active' : ''}`}
                                            onClick={() => setBarLine('Bar')}
                                        >
                                            <BarChart2 size={18} />
                                            <span>עמודות</span>
                                        </button>
                                        <button
                                            className={`chart-btn ${barLine === 'Line' ? 'active' : ''}`}
                                            onClick={() => setBarLine('Line')}
                                        >
                                            <LineChart size={18} />
                                            <span>קו</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                    {/* Charts Section */}
                    {eByType && bar1Data && (
                        <section className="charts-section">
                            <div className="chart-container">
                                {currentChart === "Doughnut" && (
                                    <>
                                        <div
                                            className={`chart-arrow left ${currentChart === "Doughnut" ? "visible" : ""}`}
                                            onClick={() => setCurrentChart("Bar1")}
                                        >
                                            →
                                        </div>
                                        <Chart type={"Doughnut"} className={"expenses-by-type"} data={eByType} />
                                    </>
                                )}
                                {currentChart === "Bar1" && (
                                    <>
                                        <div
                                            className={`chart-arrow right ${currentChart === "Bar1" ? "visible" : ""}`}
                                            onClick={() => setCurrentChart("Doughnut")}
                                        >
                                            ←
                                        </div>

                                        <div
                                            className={`chart-arrow left ${currentChart === "Bar1" ? "visible" : ""}`}
                                            onClick={() => setCurrentChart("Bar2")}
                                        >
                                            →
                                        </div>

                                        <div className="bar-charts">
                                            {selectedTab === "Total" ? (
                                                <Chart type={barLine} className={"expenses-by-month"} data={bar1Data} />
                                            ) : (
                                                <Chart
                                                    type={barLine}
                                                    className={"expenses-by-type"}
                                                    data={bar1Data}
                                                />
                                            )}
                                            {selectedTab === "Total" ? (
                                                <Chart type={barLine} className={"expenses-num-by-month"} data={bar3Data} />
                                            ) : (
                                                <Chart
                                                    type={barLine}
                                                    className={"expenses-num-by-type"}
                                                    data={bar3Data}
                                                />
                                            )}
                                        </div>
                                    </>
                                )}
                                {currentChart === "Bar2" && (
                                    <>
                                        <div
                                            className={`chart-arrow right ${currentChart === "Bar2" ? "visible" : ""}`}
                                            onClick={() => setCurrentChart("Bar1")}
                                        >
                                            ←
                                        </div>
                                        <div className="bar-charts">
                                            <Chart type={"Bar"} className={"expenses-by-month"} data={bar2Data} />
                                            <Chart type={"Bar"} className={"expenses-by-month"} data={bar4Data} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Tabs Section */}
                    {currentChart === "Bar1" && (
                        <div className="tabs">
                            <div
                                className={`tab ${selectedTab === "Total" ? "active" : ""}`}
                                onClick={() => handleTabClick("Total")}
                            >
                                סה"כ
                            </div>
                            {Array.from(new Set(loggedUser?.expenses.map(exp => exp.type))).map((type) => (
                                <div
                                    key={type}
                                    className={`tab ${selectedTab === type ? "active" : ""}`}
                                    onClick={() => handleTabClick(type)}
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Chart Details */}
                    {currentChart === "Doughnut" && eByType?.datasets && (
                        <div className="chart-details">
                            {eByType.datasets[0].data.map((d, idx) => {
                                // Calculate average value for this category across all months
                                const categoryName = eByType.labels[idx]
                                
                                // Get all months with data
                                const allMonths = [...new Set(loggedUser?.expenses.map(exp => {
                                    const expenseDate = new Date(exp.date)
                                    return `${expenseDate.getFullYear()}-${expenseDate.getMonth() + 1}`
                                }))];
                                
                                // Calculate total for this category across all time
                                const categoryTotal = loggedUser?.expenses?.reduce((acc, expense) => {
                                    if (expense.type === categoryName) {
                                        return acc + expense.paid
                                    }
                                    return acc
                                }, 0) || 0
                                
                                // Calculate average per month (considering all months even if no expenses)
                                const monthCount = allMonths.length || 1 // Avoid division by zero
                                const categoryAverage = categoryTotal / monthCount
                                
                                // Calculate percentage change from average
                                const percentChange = categoryAverage > 0
                                    ? Math.round(((d - categoryAverage) / categoryAverage) * 100)
                                    : d > 0 ? 100 : 0
                                
                                const isIncrease = percentChange > 0
                                const isZeroChange = percentChange === 0
                                
                                return (
                                    <div key={idx} className="detail-item">
                                        <span className="detail-label">{categoryName}:</span>
                                        <span className="detail-value">{d}</span>
                                        {isZeroChange ? (
                                            <span className="detail-trend neutral">
                                                <span className="trend-percent">0% מהממוצע</span>
                                            </span>
                                        ) : (
                                            <span className={`detail-trend ${isIncrease ? 'positive' : 'negative'}`}>
                                                {isIncrease ? 
                                                    <TrendingUp size={16} className="trend-icon" /> : 
                                                    <TrendingDown size={16} className="trend-icon" />
                                                }
                                                <span className="trend-percent">{isIncrease ? '+' : ''}{percentChange}% מהממוצע</span>
                                            </span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}