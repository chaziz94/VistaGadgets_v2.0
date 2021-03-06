//---------------------------------------------
//  THIS CODE IS NOT APPROVED FOR USE IN/ON ANY OTHER UI ELEMENT OR PRODUCT COMPONENT.  
//  Copyright (c) 2006 Microsoft Corporation.  All rights reserved.
// ----------------------------------------------
//VARIABLES

var L_LocalizedNumbers_text = new Array();

L_LocalizedNumbers_text[0] = "0";
L_LocalizedNumbers_text[1] = "1";
L_LocalizedNumbers_text[2] = "2";
L_LocalizedNumbers_text[3] = "3";

var pictureThemesUpperLimit = 3;

var mySettings=new calculatorSettings();
var colorIndex = 0;

//Event fired when the user has pressed ok
System.Gadget.onSettingsClosing = SettingsClosing;

function setCalculatorImage(i)
{
    var filename = "images/";
    switch (i)
    {
        case 1: filename += "settings_calc_grey.png";break;
        case 2: filename += "settings_calc_pink.png";break;
        case 3: filename += "settings_calc_yellow.png";break;
    }
    calculatorImage.src = filename;
    settingTextSet(i);
}

function settingTextSet(themeIdentifier)
{
    L_PAGE_COUNTER.innerHTML = L_LocalizedNumbers_text[themeIdentifier];
    R_PAGE_COUNTER.innerHTML = L_LocalizedNumbers_text[pictureThemesUpperLimit];
}

function calculatorSettings()
{
    this.showHistory = System.Gadget.Settings.read("ShowHistory");
    this.CalculatorColor = System.Gadget.Settings.read("CalculatorColor");
    this.historyTable = System.Gadget.Settings.read("historyTable");
    
    this.save = function()
    {
         System.Gadget.Settings.write("ShowHistory", this.showHistory );
         System.Gadget.Settings.write("CalculatorColor", this.CalculatorColor );
    }
    
    this.loadSettings = function()
    { 
        this.showHistory = System.Gadget.Settings.read("ShowHistory");
        this.CalculatorColor = System.Gadget.Settings.read("CalculatorColor");        
        colorIndex = this.CalculatorColor * 1;
        if ( this.CalculatorColor==null | this.CalculatorColor == "" )
        {
              colorIndex = 1;  //default
        }
    }  
    this.loadHistory = function()
    {
        if (this.showHistory & this.historyTable != "")
        {
            var ar_HistoryRows = this.historyTable.split(";");
            
            for (var i=0; i < ar_HistoryRows.length; i++)
            {
                if (ar_HistoryRows[i].split(":")[0] != "")
                {
                    addToHistory(ar_HistoryRows[i].split(":")[1] + " " + ar_HistoryRows[i].split(":")[0]);
                }
            }
        }    
    }
    this.writeHistory = function()
    {
       
        if (this.showHistory)
        {
            this.historyTable = "";
            
            for (var i=0; i < DISPLAY_HISTORY_TABLE.rows.length; i++)
            {
              this.historyTable += DISPLAY_HISTORY_TABLE.rows[i].cells[0].innerHTML +":"+DISPLAY_HISTORY_TABLE.rows[i].cells[1].innerHTML+ ";";
            }
            System.Gadget.Settings.write("historyTable", this.historyTable );
        }
    }
}

function SettingsClosing(event)
{
    if (event.closeAction == event.Action.commit)
    {
        SaveSettings();
    }
    else if(event.closeAction == event.Action.cancel)
    {
    }
}

function SaveSettings()
{
	//change the values in the setting object
	mySettings.showHistory = ShowHistory.checked;
	mySettings.CalculatorColor = colorIndex; 
	//save the setting
	mySettings.save();
}

function onSelLeft()
{
    
    if (colorIndex - 1 > 0)
    {
        colorIndex = colorIndex - 1;
        
    }
    else
    {
        colorIndex = 3;
    }
    setCalculatorImage(colorIndex);
}

function onSelRight()
{
    if (colorIndex + 1 <= 3)
    {
        colorIndex = colorIndex + 1;
       
    }
    else
    {
        colorIndex = 1;
    }
    setCalculatorImage(colorIndex);

}
