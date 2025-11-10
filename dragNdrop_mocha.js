
//npx mocha dragNdrop_mocha.js


const {Builder, By, until} = require ('selenium-webdriver');
const forEach = require ('mocha-each');
const { expect } = require('chai');

// --- Test Data ---
const cases = [
    {object:'draggable-1', expected: 'Draggable 1'},
    {object:'draggable-2', expected: 'Draggable 2'},
    {object:'draggable-3', expected: 'Draggable 3'},
    {object:'draggable-4', expected: 'Draggable 4'},
];


// ---- class -----
class dragNDrop {
    constructor(url){
        this.driver = null;
        this.url = url;
    }
    // open the page
    async open(){
        this.driver = await new Builder().forBrowser('chrome').build();
        await this.driver.get(this.url);
        await this.driver.manage().window().maximize();
     }

    // find the dragable object in "Items to Drag" and then drag and drop
    async dragDrop(object){
       const draggableObject = await this.driver.findElement(By.id (object));
       const dropZone = await this.driver.findElement(By.id('drop-zone'));
       await this.driver.actions()
            .dragAndDrop(draggableObject, dropZone)
            .perform();
    }
    
    // get the result text from the "Dropped Items List" zone
    async getResult(){
      const listElement = await this.driver.findElement(By.id("dropped-items-list"));
      const actualText = await listElement.getText();
      return actualText;
    }

    // pause
    async sleep(n) {
        await this.driver.sleep(n);
     }

    // close
    async close() {
        if (this.driver) {
            await this.driver.quit();
        }
    }

}

// ----- Mocha test ------
describe ( 'Drag and Drop tests' , function (){

    this.timeout (15000); 
    const dragndrop = new dragNDrop('https://yekoshy.github.io/Drag-n-Drop/SeleniumEasyDragnDrop.html');

    before(async function() {
        // open the browser
       await dragndrop.open(); 
    });

    after(async function() {
        // close the browser 
        await dragndrop.close();
    });

    cases.forEach ( ({object, expected}) => {
    it(`Testing: ${object}, and expecting: ${expected} in the "Drop here" and "Dropped Items List" zones`,async function (){
      
        await dragndrop.dragDrop(object);
        await dragndrop.sleep(500);
        const actualoutputText = await dragndrop.getResult();
        expect(actualoutputText).to.include(expected, `Failed: "${expected}" was not found in the list.`);
    })


})

})