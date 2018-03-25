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
                persentage: data.percentage
            };
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
        expensesList: '.expenses__list'
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
                html = `<div class="item" id="income-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right">
                    <div class="item__value">${obj.value}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>`;
            } else if (type === 'exp') {
                element = DOMstrings.expensesList;
                html = `<div class="item" id="expense-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right">
                    <div class="item__value">${obj.value}</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>`;
            }
            document.querySelector(element).insertAdjacentHTML('beforeend', html);            
        },
        clearFields: ()=> {
            const fields = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`);
            const fieldsArr = Array.from(fields);
            const field = fieldsArr.forEach( (el)=> {
                el.value = '';
            });
            fieldsArr[0].focus();
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
    };

    const updateBudget = ()=> {
        // calculate the budget
        budgetCtrl.calculateBudget();
        // return the budget
        const budget = budgetCtrl.getBudget();
        // display the budget on the UI
        console.log(budget);

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
        }

    };

    return {
        init: ()=> {
            setupEvents();
        }
    };
    

})(budgetController, UIController);

controller.init();