// Initialize app
var myApp = new Framework7({
    template7Pages: true,
    material: true,
    uniqueHistory : true,
    preroute: function (view, options) {
        if (!window.sessionStorage.jsessionid) {
            getLogout();
            return false; //required to prevent default router action
        }
    }
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
//Configuration for Camera
var pictureSource;
var destinationType;
var filteredList;
//var viewDocument;
//Configuration for Infinite Scrolling
var loading = false;
var lastIndex;
// Max items to load
var maxItems = 50;
// Append items per load
var itemsPerLoad = 10;

var lastIndexDoc = 0;
var limitDoc = 10;
var docTableData;



var months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
var days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

$$.ajaxSetup({headers: {'Access-Control-Allow-Origin': '*'}});
var mainView = myApp.addView('.view-main', {dynamicNavbar: true, });

$$(document).on('deviceready', function () {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    //Necessarie per navigare il file system
//    myPath = cordova.file.externalRootDirectory;
//    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
});

/*---------------------------------------
 On ALL pages
 ---------------------------------------*/
//Before Init
myApp.onPageBeforeInit('*', function (page) {

});
//Init for every page
//
myApp.onPageInit("*", function () {

});


/*---------------------------------------
 On EACH page
 ---------------------------------------*/

//INDEX
var index = myApp.onPageInit('index', function () {

    if (typeof window.sessionStorage.jsessionid !== 'undefined' &&
            window.sessionStorage.jsessionid !== null &&
            window.sessionStorage.jsessionid !== "") {
       verifyUserProfile();
    } else {
        myApp.loginScreen(".login-screen", false);
    }



    $$("#btn-logout").click(function () {
        window.sessionStorage.clear();
        myApp.loginScreen(".login-screen", false);
    });
    $$("#btn-login").click(function () {

        var formLogin = myApp.formGetData('frm-login');
        //Get Form Login
        var chkLogin;
        chkLogin = validateUser(formLogin.username, formLogin.password);

        if(chkLogin){
            window.sessionStorage.setItem("username", formLogin.username);  //Set user in session
            window.sessionStorage.setItem("authorized", 1);                 //Set token auth
            $$("#box-welcome").html("Benvenuto " + window.sessionStorage.username);
            myApp.closeModal(".login-screen", false);
            getUserProfile();
            getUserAnag();
            getUserInfo();
            verifyUserProfile();
        }
        else{
            myApp.alert("User name o password errati","Login error");
        }
    });


}).trigger();

//MANAGE TICKET
var manage_ticket = myApp.onPageInit('manage_ticket', function (page) {
    //Pull to refresh
    var ptrContent = $$('.pull-to-refresh-content');
    ptrContent.on('ptr:refresh', function (e) {
        setTimeout(function () {
            myApp.pullToRefreshDone();
            mainView.router.reloadPage("manage_ticket.html");
        }, 1000);
    });

    //var myList = getTktDataByFilter('0','10',filter, sort);
    var myList; var lastIndexDoc; var limitDoc; var maxItems;
    if(!filteredList){
        var stringFilterOnlyUsername = 'oslc.select=*&oslc.where=reportedby="'+window.sessionStorage.username+'"';
        myList = getMaximoTktList(stringFilterOnlyUsername);
    // myList = getTktDataByFilter(lastIndex, itemsPerLoad, filter, sort);

    }else{
        myList = filteredList;
    }
    if (myList && !myList.member.length > 0){
        $$('.infinite-scroll-preloader').remove();
        if(!filteredList){
            myApp.alert("Nessun ticket trovato per l'utente <b>"+window.sessionStorage.username+"</b>", ["Nessun ticket trovato" ]);
        }else{
            myApp.alert("Modificare la ricerca", ["Nessun ticket trovato" ]);
        }
        filteredList = undefined;
        return;
    }
    lastIndexDoc = 0;
    limitDoc = 15;
    if(!myList){
        return;
    }
    maxItems = myList.responseInfo.totalCount;
      if (lastIndexDoc < maxItems) {
            $$('.infinite-scroll-preloader').removeClass('nodisplay');
        } else {
            $$('.infinite-scroll-preloader').addClass('nodisplay');
            return;
        }
    var cols = ["ticketid", "externalsystem", "description", "status", "reportedby", "affectedperson", "creationdate"];
    var heads = ["ID Ticket", "Descrizione", "Stato", "Aperto Da", "Assegnato A", "Data creazione"];

    buildTicketTable(myList.member, cols, heads, limitDoc, lastIndexDoc);
    lastIndexDoc = lastIndexDoc + limitDoc;

    // lastIndex = itemsPerLoad + 1;

    $$('.infinite-scroll').on('infinite', function () {
        // Exit, if loading in progress
        if (loading)
            return;
        // Set loading flag
        loading = true;
        // Emulate 0.5s loading
        setTimeout(function () {
            // Reset loading flag
            loading = false;
            if (lastIndexDoc >= maxItems) {
                // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                myApp.detachInfiniteScroll($$('.infinite-scroll'));
                // Remove preloader
                $$('.infinite-scroll-preloader').remove();
                return;
            }
            var newList;
            buildTicketTable(myList.member, cols, heads, limitDoc, lastIndexDoc);
            lastIndexDoc = lastIndexDoc + limitDoc;
        }, 500);
    });

});

//NEW TICKET
var new_tkt = myApp.onPageInit("new_tkt", function (page) {
    myApp.closeModal(".login-screen", false);
    $$('#file-to-upload').on('change', function(){
        // alert($$(this).val());
        $$('#file-label').html( $$(this).val().replace(/C:\\fakepath\\/i, '') );
        // console.log('filename: '+$$("#file-to-upload")[0].files[0].name);
        // console.log('filetype:  '+$$("#file-to-upload")[0].files[0].type);
    });
    $$(".btn-camera-upload").click(function () {
        capturePhotoWithData();
    });

    $$('#btn-new-ticket').on('click', function(e){
        e.preventDefault();
        myApp.showPreloader();
        setTimeout(function () {newTicket();}, 1000);

    });
});

//FILTER TICKET
var filterTicket = myApp.onPageInit('filterTicket', function (page) {
    var myCalendarTicket = myApp.calendar({
        input: '.datePickerFrom',
        dateFormat: 'dd/mm/yyyy',
        closeOnSelect: true,
        monthNames: months,
        dayNamesShort: days
    });
    var myCalendar2Ticket = myApp.calendar({
        input: '.datePickerTo',
        dateFormat: 'dd/mm/yyyy',
        closeOnSelect: true,
        monthNames: months,
        dayNamesShort: days
    });
    $$('#btn-filterTicket').on('click', function () {
        var dateFrom = formatDateFromItalian($$('.datePickerFrom').val());
        var dateTo = formatDateFromItalian($$('.datePickerTo').val());
        var status= $$('.filterStatusSelect').val();
        var desc = $$('.filterDescText').val();
        var filterTicketsString = toFilterTickets(dateFrom, dateTo, status, desc);
        filteredList = getMaximoTktList(filterTicketsString);
        mainView.router.reloadPage("manage_ticket.html");

    });

});
//DETAIL TICKET
var ticketPage = myApp.onPageInit('ticketPage', function (page) {
    var ticketId = page.query.id;
    var stringFilter = 'oslc.select=*&oslc.where=ticketid="'+ticketId+'"';
    var ticket = getMaximoTktList(stringFilter);
    if(!ticket){
        myApp.alert("Dettagli del ticket "+ticketId+" non disponibili");
        return;
    }
    populateTicketPageDetails(ticket.member[0]);

    $$('#btn-valuta-ticket').on('click', function () {
        myApp.showPreloader();
        setTimeout(function () { prepareEval();}, 1000);

    });
});

// DOC PAGE
var doc_page = myApp.onPageInit('doc_page', function (page) {
    // Prendo i parametri dalla pagina e setto il titolo e il campo hidden per il submit della form
//    var title = page.query.pageName.replace(/_/g, ' ');
//    var inputHiddenId = page.query.idPage;

//    $$('.titleDocumentPage').text(title);
//    $$('.hiddenInputId').val(inputHiddenId);

    var myCalendar = myApp.calendar({
        input: '.datePickerFrom',
        dateFormat: 'dd/mm/yyyy',
        closeOnSelect: true,
        monthNames: months,
        dayNamesShort: days
    });
    var myCalendar2 = myApp.calendar({
        input: '.datePickerTo',
        dateFormat: 'dd/mm/yyyy',
        closeOnSelect: true,
        monthNames: months,
        dayNamesShort: days
    });
//  $(".onlyNumber").on('keyup keydown change keypress', function (e) {
//     //if the letter is not digit then display error and don't type anything
//     if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
//        //display error message
//               return false;
//    }
//   });
    $$('.infinite-scroll').on('infinite', function () {
        // Exit, if loading in progress
        if (loading)
            return;
        // Set loading flag
        loading = true;
        // Emulate 1s loading

        lastIndexDoc = limitDoc;
        limitDoc = limitDoc + 10;

        if (lastIndexDoc < docTableData.length) {
            $$('.infinite-scroll-preloader').removeClass('nodisplay');
        } else {
            $$('.infinite-scroll-preloader').addClass('nodisplay');
            return;
        }
        setTimeout(function () {
            // Reset loading flag
            loading = false;
            buildDocumentTable(docTableData, ['Numero', 'Nome', 'Data', 'E-mail', 'PDF'], limitDoc, lastIndexDoc);
            $$('.backToTop').removeClass('nodisplay');
        }, 1000);
    });

    $$('.backToTop').on('click', function () {
         $('.page-content').animate({scrollTop: 0}, 500);
    });

    $$('.submitDocForm').on('click', function () {
//        myApp.showPreloader(); da decommentare e aggiungere  myApp.hidePreloader(); dopo la creazione della tabella
//        var ref = cordova.InAppBrowser.open('http://www.pdf995.com/samples/pdf.pdf', '_system', 'location=yes'); codice apertura pdf da URL
//
        //svuoto la tabella se è già popolata prima di effettuare una nuova ricerca
        myApp.showPreloader();
        $$('.backToTop').addClass('nodisplay');
        $$('.tbodyDocumentList').empty();
        docTableData = [];
//        var docType = inputHiddenId;
        var docAmountFrom = $$('.docAmountFrom').val();
        var docAmountTo = $$('.docAmountTo').val();
        var dateFrom = formatDateFromItalian($$('.datePickerFrom').val());
        var dateTo = formatDateFromItalian($$('.datePickerTo').val());
        var docContains = $$('.docContains').val();
        //modifico se vuoto
        docAmountFrom = (docAmountFrom === "") ? '0' : docAmountFrom;
        docAmountTo = (docAmountTo === "") ? '99999999' : docAmountTo;
        docContains = (docContains === "") ? 'ALL' : docContains;
        dateFrom = (dateFrom === "") ? '1970-01-01' : dateFrom;
        dateTo = (dateTo === "") ? '2049-01-01' : dateTo;

        lastIndexDoc = 0;
        limitDoc = 10;
        setTimeout(function () { searchDocWithFilters(docAmountFrom,docAmountTo, dateFrom, dateTo, docContains, limitDoc, lastIndexDoc); }, 1000);
        loading = false;
        $('.page-content').animate({scrollTop: 330}, 500);
    });



});



//Funzioni per il caricamento da file system
//function listPath(myPath) {
//    var backLink = '<div onclick="listPath(' + "'" + myPath + "'" + ');" >' + myPath + '</div>';
//    $$(".popup-filebrowser .title").html(backLink);
//    window.resolveLocalFileSystemURL(myPath, function (dirEntry) {
//        var directoryReader = dirEntry.createReader();
//        directoryReader.readEntries(onSuccessCallback, onFailCallback);
//    });
//}

//function onSuccessCallback(entries) {
//    var html = '';
//    for (i = 0; i < entries.length; i++) {
//        var row = entries[i];
//        if (row.isDirectory) {
//            // We will draw the content of the clicked folder
//            html += '<li onclick="listPath(' + "'" + row.nativeURL + "'" + ');" class="directory"><i class="icons f7-icons">folder</i>' + row.name + '</li>';
//        } else {
//            // alert the path of file
//            html += '<li onclick="getFilepath(' + "'" + row.nativeURL + "'" + ');" class="file"><i class="icons f7-icons">tags</i>' + row.name + '</li>';
//        }
//    }
//    if (html != "")
//        $$(".popup-filebrowser #list-element").html(html);
//    else
//        $$(".popup-filebrowser #list-element").html("No elements!");
//}
//
//function onFailCallback(e) {
//    alert(error.e)
//}
//
//function getFilepath(thefilepath) {
//    alert(thefilepath);
//}
