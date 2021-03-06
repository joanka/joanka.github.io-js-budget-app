const budgetController = (()=> {

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
     }

    class Expense {
       constructor(id, description, value) {
           this.id = id;
           this.description = description;
           this.value = value;
           this.percentage = -1;
       }
       calcPercentage(totalIncome) {
            if (totalIncome > 0) {
                this.percentage = Math.round((this.value / totalIncome) * 100);
            } else {
                this.percentage = -1;
            }           
        }
        getPercentage() {
            return this.percentage;
        }
    } 
    
    const data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    };

    const calculateSum = (type)=> {
        const sum = data.allItems[type].reduce( (prev, current)=> {
            return prev + current.value;             
        }, 0);
        data.totals[type] = sum;
    };

    return {
        addNewItem: (type, des, val)=> {
            let newItem, lastItem, id;
            // create new id           
            if( data.allItems[type].length > 0) {
                lastItem = data.allItems[type].length - 1;
                id = data.allItems[type][lastItem].id + 1;
            } else {
                id = 0;
            }            
            // create new item based on 'inc' or 'exp' type
            if( type === 'inc') {
                    newItem = new Income(id, des, val);
            } else if(type === 'exp') {
                    newItem = new Expense(id, des, val);
            }
            // push new item into data structure
            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteBudgetItem: (type, id)=> {
            let itemToDelete;
            itemToDelete = data.allItems[type].map( (item)=> {
                return item.id;                
            });
            let index = itemToDelete.indexOf(id);
            if( index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: ()=> {
            // calculate all income and expenses
            calculateSum('inc');
            calculateSum('exp');
            // calculate the budget
            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage of income
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }            
        },
        getBudget: ()=> {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        calculateExpPercentage: ()=> {
            data.allItems.exp.forEach( (el)=> {
                el.calcPercentage(data.totals.inc);
            });
        },
        getExpPercentage: ()=> {
            const percentages = data.allItems.exp.map( (el)=> {
                return el.getPercentage();
            });
            return percentages;
        },
        testing: ()=> {
            console.log(data);
        }
    };      
})();


const UIController = (()=> {

    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn',
        incomeList: '.income__list',
        expensesList: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container-list',
        expPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    const formatNumber = (num, type)=> {
        let splitNum, int, dec;
        num = Math.abs(num).toFixed(2);
        splitNum = num.split('.');
        int = splitNum[0];
        dec = splitNum[1];

        if (int.length > 3) {
            int = `${int.substr(0, int.length - 3)},${int.substr(int.length - 3, 3)}`;
        }
        return `${(type === 'inc' ? '+' : '-')} ${int}.${dec}`;        
    };

    return {
        getInput: ()=> {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };           
        },
        addListItem: (obj, type)=> {
            // create HTML string with placeholder text and the object data
            let html, element;
            if( type === 'inc') {
                element = DOMstrings.incomeList;
                html = `<div class="item" id="inc-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right">
                    <div class="item__value">${formatNumber(obj.value, 'inc')}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>`;
            } else if (type === 'exp') {
                element = DOMstrings.expensesList;
                html = `<div class="item" id="exp-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right">
                    <div class="item__value">${formatNumber(obj.value, 'exp')}</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>`;
            }
            document.querySelector(element).insertAdjacentHTML('beforeend', html);            
        },
        deleteListItem: (itemId)=> {
            const item = document.querySelector(`#${itemId}`);
            item.parentNode.removeChild(item);
        },
        clearFields: ()=> {
            const fields = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`);
            const fieldsArr = Array.from(fields);
            const field = fieldsArr.forEach( (el)=> {
                el.value = '';
            });
            fieldsArr[0].focus();
        },
        displayBudget: (obj)=> {
            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = `${obj.percentage}%`;
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }            
        },
        displayExpPercentage: (percentages)=> {
            let fields = document.querySelectorAll(DOMstrings.expPercentageLabel);
            let fieldsArr = Array.from(fields);

            fieldsArr.forEach( (el, index)=> {
                if( percentages[index] > 0) {                   
                    el.textContent = `${percentages[index]}%`;  
                } else {
                    el.textContent = '---';
                }                   
            });                      
        },
        displayDate: ()=> {
            let currentYear = new Date().getFullYear(); 
            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            let currentMonth = new Date().getMonth();                     
            document.querySelector(DOMstrings.dateLabel).textContent = `${months[currentMonth]} ${currentYear}`;
        },
        changeIputBorder: ()=> {
            const fields = document.querySelectorAll(`${DOMstrings.inputType},${DOMstrings.inputDescription},${DOMstrings.inputValue}`);
            fields.forEach( (field)=> {
                field.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.addBtn).classList.toggle('red');
        },
        getDOMstrings: ()=> {
            return DOMstrings;
        }
    };
})();


const controller = ((budgetCtrl, UICtrl)=> {

    const setupEvents = ()=> {
        const DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.addBtn).addEventListener('click', addItem);

        document.addEventListener('keypress', (e)=> {
            if(e.keyCode === 13 || e.which === 13 ) {
                addItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', deleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeIputBorder);

        const fields = document.querySelectorAll(`${DOM.inputType},${DOM.inputDescription},${DOM.inputValue}`);
        fields.forEach( (field, index, array)=> {            
            field.addEventListener('keydown', (e)=> {
                if(e.keyCode === 39 || e.which === 39) {
                    let nextInput = index + 1;                            
                    if (nextInput < array.length) { 
                        array[nextInput].focus();
                    }
                } else if (e.keyCode === 37 || e.which === 37) {
                    let prevInput = index - 1;   
                    if (prevInput >= 0) { 
                        array[prevInput].focus();
                    }
                }
            });            
        });        
    };

    const updateBudget = ()=> {
        // calculate the budget
        budgetCtrl.calculateBudget();
        const budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);
    };

    const updateExpPercentage = ()=> {
        // calculate the expense percentage
        budgetCtrl.calculateExpPercentage();
        const percentages = budgetCtrl.getExpPercentage();
        UICtrl.displayExpPercentage(percentages);
    };

    const addItem = ()=> {
        // get the input field data
        const input = UICtrl.getInput();
        
        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // add the item to the budget controller
            const newItem = budgetCtrl.addNewItem(input.type, input.description, input.value);
            // add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            // clear the fields
            UICtrl.clearFields();
            // update budget
            updateBudget();
            // update expPercentage
            updateExpPercentage();
        }
    };

    const deleteItem = (e)=> {
        let itemId, splitId, type, ID;
        itemId = e.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            ID = parseInt(splitId[1]);
            // delete item from budgetController
            budgetCtrl.deleteBudgetItem(type, ID);        
            // delete item from UI
            UICtrl.deleteListItem(itemId);
            // update budget
            updateBudget();
            // update expPercentage 
            updateExpPercentage();           
        }       
    };

    return {
        init: ()=> {
            UICtrl.displayDate();
            updateBudget();
            setupEvents();                        
        }
    };   

})(budgetController, UIController);

controller.init();