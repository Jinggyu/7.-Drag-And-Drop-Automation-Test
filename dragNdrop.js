const { Builder, By, until } = require('selenium-webdriver');

async function testDragAndDrop() {
    let driver = await new Builder().forBrowser('chrome').build(); 
    const targetUrl = 'https://yekoshy.github.io/Drag-n-Drop/SeleniumEasyDragnDrop.html'; 
    const TIMEOUT = 10000;

    // --- Locators ---
    // The source element to drag ("Draggable 1")
    const DRAGGABLE_ELEMENT = By.xpath("//div[@id='draggable-1'][text()='Draggable 1']"); 
    
    // The target element to drop onto ("Drop here" area)
    const DROP_ZONE = By.id('drop-zone');
    
    // The locator for the success message that appears inside the drop zone
    const SUCCESS_MESSAGE = By.xpath("//div[@id='drop-zone']/p[text()='Dropped!']");

    try {
        await driver.get(targetUrl);
        await driver.manage().window().maximize();

        console.log(`1. Navigated to ${targetUrl}`);

        // 1. Wait for both elements to be visible and ready
        const draggable = await driver.wait(
            until.elementIsVisible(driver.findElement(DRAGGABLE_ELEMENT)), 
            TIMEOUT, 
            'Draggable element not visible.'
        );
        const dropZone = await driver.wait(
            until.elementIsVisible(driver.findElement(DROP_ZONE)), 
            TIMEOUT,
            'Drop zone not visible.'
        );

        console.log("2. Draggable element and drop zone are ready.");

        // 2. Perform the Drag and Drop using the concise dragAndDrop() method.
        // FIX: Accessing the Actions interface via driver.actions() is the most reliable way 
        // to avoid the "Actions is not a constructor" error.
        await driver.actions()
            .dragAndDrop(draggable, dropZone)
            .perform();

        console.log("3. Performed drag and drop action.");
        
        // --- ASSERTION: Verify the drag and drop was successful ---
        
        // 4. Wait for the success message (p tag with text 'Dropped!') to appear.
        const successIndicator = await driver.wait(
            until.elementLocated(SUCCESS_MESSAGE), 
            TIMEOUT,
            'Success message "Dropped!" did not appear.'
        );
        
        if (await successIndicator.isDisplayed()) {
             console.log("✅ Assertion Passed: The success message 'Dropped!' is displayed in the drop zone.");
        } else {
            console.error("❌ Assertion Failed: Drag and drop was not successful.");
        }

    } catch (error) {
        console.error("An error occurred during the test:", error.message);
    } finally {
        await driver.quit();
        console.log("Browser closed.");
    }
}

testDragAndDrop();