//----------------------------------------------
//  THIS CODE IS NOT APPROVED FOR USE IN/ON ANY OTHER UI ELEMENT OR PRODUCT COMPONENT.  
//  Copyright (c) 2006 Microsoft Corporation.  All rights reserved.
//----------------------------------------------
function CurrencyService() {
    var me = this;
    
    // Private members
    var m_oService;
    var m_oCurrencyData;
    
    this.hsCurrencies;
    this.OnDataReady = null;
    
    function FireOnDataReady(oData) 
    {
        me.OnDataReady(oData);
    }
    
    function OnDataReady(data) {
        // Reset the state of the service
        me.IsAvailable = false;
        me.hsCurrencies = new Array();
        
        if(data === undefined) {
            data = null;
        }
        
        if(data !== null && data.RetCode == 200) {
            m_oCurrencyData = data;
            
            // Massage the currency data to make it
            // more readable to work with for a 
            // currency converter.
            for(var i=0; i < data.Count; i++) {
                var currency = new Object();
                
                currency.Symbol = data.Item(i).Symbol;
                currency.Name = getLocalizedString(data.Item(i).Symbol);
                currency.PerDollar = data.Item(i).Last;
                currency.NameForSorting = data.Item(i).LCMapName(currency.Name);
                
                me.hsCurrencies[data.Item(i).Symbol] = currency;
            }
            
            me.IsAvailable = true;
        }
        
        FireOnDataReady(data);
    }
    
    this.IsAvailable = false;
    
    this.Convert = function(fFromAmount, sFromSymbol, sToSymbol) {
        if(fFromAmount == '')
            fFromAmount = 0;
        var decimals = 0;
        if (System.Gadget.docked)
        {
            decimals = 3;
        }
        else
        {
            decimals = 5;
        }
        if(m_oService != null) {
            return '' + m_oCurrencyData.Convert(fFromAmount, sFromSymbol, sToSymbol, decimals).replace(/^\s+/g, '').replace(/\s+$/g, '');
        } else {   
           FireOnDataReady(null);
           return 0;
        }
    }
    
    this.GetCurrencies = function() {
        
        if (m_oService != null) 
            m_oService.GetCurrencies();
        else
            FireOnDataReady(null);
    }    
    
    // Constructor
    function Initialize() {
        
        try {
            var oMSN = new ActiveXObject("wlsrvc.WLServices");
            m_oService = oMSN.GetService("Currency");
            m_oService.OnDataReady = OnDataReady;
        } catch (objException) {
            m_oService = null;
        }
    }
    
    Initialize();
}

