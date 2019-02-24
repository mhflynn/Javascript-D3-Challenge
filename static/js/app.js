/**********************************************************************
 * 
 * Javascript - D3 HW-14
 *   - This solution implements Level 1 and Level 2 solutions
 *   - For Level 2, multiple categories are available for filtering,
 *   - but only one category at a time is supported
 * 
 * Implementation
 *   - 3 primary functions defined :
 *      - filterUpdate() : Handles transition between filter category
 *        selections. 5 buttons are used to select filter category, when 
 *        one is pressed, the input label and place holder are changed
 *        to reflect the current category. The data table is refreshed
 *        without any filter applied.
 * 
 *      - tableUpdate() : Refresh the table with or without a filter
 *        applied, based on the input arguments. A call with no input 
 *        arguments will remove any filter and show full table content.
 * 
 *      - filtButton() - Called when form input is submitted. The filter
 *        value from the form's input box, and filter categroy for the 
 *        current filter selection are passed to tableUpdate to show a 
 *        filter table results.
 * 
 * Notes
 *   - To maximize view of the table, graphics are hidden when a filter
 *     value is submitted or when the filter category changes. 
 *   - Javascript Date object is used for the date input, to get improved 
 *     support for input date formats, but improvement seems limited. 
 */

// Dictionary to hold filter menu keys and values for form label and place holder
const filtMenu = {
    'Date': {'dataKey':'datetime', 'placeHolder':'1/11/2011', 'label':'Enter a date (mm/dd/yyyy)'},
    'City': {'dataKey':'city', 'placeHolder':'San Diego', 'label':'Enter a city name ...'},
    'State':{'dataKey':'state', 'placeHolder':'CA', 'label':'Enter a state name ...'},
    'Country':{'dataKey':'country', 'placeHolder':'US', 'label':'Enter a country name ...'},
    'Shape':{'dataKey':'shape', 'placeHolder':'Circle', 'label':'Enter a shape ...'}};

let filtButton = d3.select('#filter-btn');
let menuButtons = d3.select('#filt-group').selectAll('button');

//***********************************************
// Initialize / Update page table and filter form

function filterUpdate (btn = '#btn-date') {

    // Get menu key for current filter selection
    let menuKey = d3.select(btn).property('name');

    // Initilalize filter form contents
    let filtForm = d3.select('#filter-form');
    filtForm.attr('placeholder', filtMenu[menuKey]['placeHolder']);
    filtForm.property('value', '');

    // Update form label to reflect filter selection
    d3.select('#filter-label').text(filtMenu[menuKey]['label']);

    // Intialize/Update filter selection buttons
    d3.selection('#filt-group').selectAll('button').classed('active', false);
    d3.select(btn).classed('active', true);

    // Initialize/Update the page table contents
    tableUpdate();
}

//***********************************************
// Initialize / Filter the page table entries

function tableUpdate (filtVal = null, menuKey = 'Date') {

    let filtTable = [];               // Initialize empty filtered table
    let dataKey  = filtMenu[menuKey]['dataKey'];

    if (!filtVal) {
        filtTable = data;
    }
    else if (menuKey == 'Date') {
        let filtDate = new Date(filtVal).getTime();
        filtTable = data.filter(row => filtDate == new Date(row[dataKey]).getTime());
    }
    else {
        let filtStr = filtVal.toLowerCase();
        filtTable = data.filter(row => filtStr == row[dataKey].toLowerCase());
    }

    // Add filtered data content to page table
    let tbody = d3.select('tbody');   // Select the page table body
    tbody.selectAll('tr').remove();   // Clear current table body contents (if any)
    
    // Populate page table with filtered data rows
    filtTable.forEach(row => {
        tr = tbody.append('tr');
        Object.values(row).forEach(k => tr.append('td').text(k))
    });
}

//***********************************************
// Handler for filter button press

filtButton.on('click', function() {

    // Prevent the page from refreshing
    d3.event.preventDefault();
  
    // Get filter value from the form input (value property)
    let filtVal = d3.select('#filter-form').property('value');

    // Get menu key from the current filter selection (current active button name property)
    let menuKey = d3.select('#filt-group').select('.active').property('name');
    
    // Filter the table based on input 
    tableUpdate(filtVal, menuKey);

    // Hide graphic and scoll to the top to maximize table view
    pageTop();
  });

//***********************************************
// Handler for filter selection buttons

menuButtons.on('click', function() {
    filterUpdate(this);
    pageTop();
});

//***********************************************
// Utility function to hide graphic and scroll page to top

function pageTop() {
    d3.select('.hero').style('display','none');   // Hide graphic
    window.scrollTo(0,0);                         // Scroll window to the top
}

// Initialize processing
filterUpdate();
