const budgetController = (()=> {

    
})();


const UIController = (()=> {

    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn'
    };

    return {
        getInput: ()=> {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };           
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

        document.querySelector(DOM.addBtn).addEventListener('keypress', (e)=> {
            if(e.keyCode === 13 || e.which === 13 ) {
                addItem();
            }
        });
    };

    const addItem = ()=> {
        const input = UICtrl.getInput();
    };

    return {
        init: ()=> {
            setupEvents();
        }
    };
    

})(budgetController, UIController);

controller.init();