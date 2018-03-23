
/*---------------------------------------
Initial setup
 ---------------------------------------*/

var URL_ENDPOINT = 'https://portal.gabriellispa.it';
//var URL_ENDPOINT = 'http://192.168.2.90:9080';
//var TEST_URL = 'http://192.168.81.215:9080';
var TEST_URL = 'https://portal.gabriellispa.it';


//Funzione per settare un obj nel sessionStorage

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


//FILTER STRING
var pageSizeFilterTickets=20;


var months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
var days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
/*---------------------------------------
 Table Construction
 ---------------------------------------*/

function buildHtmlTable(myList) {
    var columns = addAllColumnHeaders(myList);
    buildHtmlTableBody(myList, columns);
}
function buildHtmlTableBody(myList, columns) {
    for (var i = 0; i < myList.length; i++) {
        var row$ = $$('<tr/>');
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = myList[i][columns[colIndex]];
            if (cellValue === null) {
                cellValue = "";
            }
            row$.append($$('<td data-collapsible-title="' + [columns[colIndex]] + '"/>').html('<a href="ticket/ticketPage.html?id=' + myList[i][columns[0]] + '" class="ticket-info">' + cellValue + '</a>'));
        }
        $$(".data-table > table > tbody").append(row$);
    }
}
function addAllColumnHeaders(myList) {
    var columnSet = [];
    var headerTr$ = $$('<tr/>');
    for (var i = 0; i < myList.length; i++) {
        var rowHash = myList[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) === -1) {
                console.log(key);
                columnSet.push(key);
                headerTr$.append($$('<th/>').html(key));
            }
        }
    }
    $$(".data-table > table > thead").append(headerTr$);
    return columnSet;
}

/*---------------------------------------
 Fotocamera
 ---------------------------------------*/
function onPhotoDataSuccess(imageData) {
    var smallImage = $$('#small-image');
    smallImage.css("display", "block");
    smallImage.attr("src", "data:image/jpeg;base64," + imageData);
}
// Called when a photo is successfully retrieved
function onPhotoFileSuccess(imageData) {
    var smallImage = $$('#small-image');
    smallImage.css("display", "block");
    smallImage.attr("src", imageData);
}
// Called when a photo is successfully retrieved
function onPhotoURISuccess(imageURI) {
    var largeImage = document.getElementById('large-image');
    largeImage.style.display = 'block';
    largeImage.src = imageURI;
}
// A button will call this function
function capturePhotoWithData() {
    var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL, //Return Base64
        sourceType: Camera.PictureSourceType.CAMERA,
        mediaType: Camera.MediaType.PICTURE,
        encodingType: Camera.EncodingType.JPEG,
    };
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, options);
}
function capturePhotoWithFile() {
    var options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI, //Return Base64
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        mediaType: Camera.MediaType.ALLMEDIA,
    };
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, options);
}


/*
 * LOGICA SIMILE PER LE ISPEZIONI, CAMBIA LA POSSIBILITA' DI INSERIRE PIU' FOTO
 */




function onPhotoDataSuccessMULTI(imageData) {
    var numeroImg = $$('.imgContent').length;
    var smallImage = $$('<div class="row imgContent" data-numeroImg="'+numeroImg+'"><img src ="data:image/jpeg;base64,' +imageData+'" class="camera-upload-thumb small-imageMulti"><i class="f7-icons customDeleteImg" onclick="deleteImg('+numeroImg+')">close</i></div>');
    $$('.imgWrapper').append($$(smallImage));

}
// Called when a photo is successfully retrieved
function onPhotoFileSuccessMULTI(imageData) {
   var numeroImg = $$('.imgContent').length;
    var smallImage = $$('<div class="row imgContent" data-numeroImg="'+numeroImg+'"><img src ="data:image/jpeg;base64,' +imageData+'" class="camera-upload-thumb small-imageMulti"><i class="f7-icons customDeleteImg" onclick="deleteImg('+numeroImg+')">close</i></div>');
    $$('.imgWrapper').append($$(smallImage));
}
// Called when a photo is successfully retrieved
function onPhotoURISuccessMULTI(imageURI) {
    var largeImage = document.getElementById('large-image');
    largeImage.style.display = 'block';
    largeImage.src = imageURI;
}
// A button will call this function
function capturePhotoWithDataMULTI() {
    var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL, //Return Base64
        sourceType: Camera.PictureSourceType.CAMERA,
        mediaType: Camera.MediaType.PICTURE,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation : true
    };
    navigator.camera.getPicture(onPhotoDataSuccessMULTI, onFail, options);
}
function capturePhotoWithFileMULTI() {
    var options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI, //Return Base64
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        mediaType: Camera.MediaType.ALLMEDIA,
        correctOrientation : true
    };
    navigator.camera.getPicture(onPhotoDataSuccessMULTI, onFail, options);
}
// A button will call this function
function getPhoto(source) {
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source});
}
function onFail(message) {}

function buildDocumentTable(myList, columns, limit, lastIndexDoc) {
    if ($$('.headerTable').length === 0 && myList.length > 0) {
        var headerTr$ = $$('<tr/>');
        for (var i = 0; i < columns.length; i++) {
            headerTr$.append($$('<th class="headerTable"/>').html(columns[i]));
        }
        $$(".data-table > table > thead").append(headerTr$);
    }
    if (myList.length === 0) {
        $$(".data-table > table > thead").empty();
    }

    var filterMyList = [];

    for (var i = lastIndexDoc; i < limit && i < myList.length; i++) {
        filterMyList.push(myList[i]);
    }



    for (var i = 0; i < filterMyList.length; i++) {
        var row$ = $$('<tr/>');
        //DA MODIFICARE L'EMAIL DELLA RISPOSTA CON I VALORI EFFETTIVAMENTE RESTITUITI DAL JSON 
        // PER REVERT SOSTITUIRE EX filterMyList[i].NumeroDocumento CON filterMyList[i].docNumber ECC...
        var cellValue = {'docNumber': filterMyList[i].NumeroDocumento, 'docTitle': filterMyList[i].Title, 'docDate': filterMyList[i].DataDocumento, 'docImporto': filterMyList[i].Importo, 'docLinkEmail': filterMyList[i].doclink, 'docPdf_Key_Doc_RISFA': filterMyList[i].KEY_DOC,'docPdf_LinkUrl_SHARE_POINT': filterMyList[i].LinkUrl}
        row$.append($$('<td data-collapsible-title="' + columns[0] + '"/>').html('<a href="#" class="doc-info_number">' + cellValue.docNumber + '</a>'));
        row$.append($$('<td data-collapsible-title="' + columns[1] + '"/>').html('<a href="#" class="doc-info_title">' + cellValue.docTitle + '</a>'));
        row$.append($$('<td data-collapsible-title="' + columns[2] + '"/>').html('<a href="#" class="doc-info_date">' + formatDateFromTimeStampToItalian(cellValue.docDate) + '</a>'));
        row$.append($$('<td data-collapsible-title="' + columns[3] + '"/>').html('<a href="#" class="doc-info_importo"> &#8364; ' + formatAmountToFloat(cellValue.docImporto) + '</a>'));
        //valorizzo il link del pdf in modo da distinguere risfa e sharepoint
        var urlToOpenPdf="";

        if(cellValue.docPdf_Key_Doc_RISFA){
            urlToOpenPdf = URL_ENDPOINT+"/AFBNetWS/DocumentFileServlet?jSessionID="+window.sessionStorage.jsessionid+"&KeyDoc_RF="+cellValue.docPdf_Key_Doc_RISFA;         
            row$.append($$('<td data-collapsible-title="' + columns[4] + '"/>').html('<a href="#" class="doc-info_email" data-KeyDoc_RF="' +cellValue.docPdf_Key_Doc_RISFA+ '" data-doc_title="' + cellValue.docTitle + '" data-LinkUrlDocumento_SP=""><i class="f7-icons">email</i></a>'));
        }else if(cellValue.docPdf_LinkUrl_SHARE_POINT){
            urlToOpenPdf = URL_ENDPOINT+"/AFBNetWS/DocumentFileServlet?jSessionID="+window.sessionStorage.jsessionid+"&LinkUrlDocumento_SP="+cellValue.docPdf_LinkUrl_SHARE_POINT;            
            row$.append($$('<td data-collapsible-title="' + columns[4] + '"/>').html('<a href="#" class="doc-info_email" data-KeyDoc_RF="" data-doc_title="' + cellValue.docTitle + '" data-LinkUrlDocumento_SP="'+cellValue.docPdf_LinkUrl_SHARE_POINT+'"><i class="f7-icons">email</i></a>'));
        }
        
     
        row$.append($$('<td data-collapsible-title="' + columns[5] + '"/>').html('<a href="#" class="doc-info_pdf" data-linkpdf="' + urlToOpenPdf + '"><i class="f7-icons">document_text_fill</i></a>'));
        $$(".data-table > table > tbody").append(row$);
    }
        $$('.doc-info_pdf').on('click', function (e) {
         var linkPDF = e.currentTarget.getAttribute("data-linkpdf");
         //myApp.alert('url: '+linkPDF);
         if(linkPDF){
            //var ref = cordova.InAppBrowser.open(linkPDF, '_system', 'location=yes');
          var ref = window.open(linkPDF, '_blank', 'location=yes'); 
         }else{
             myApp.alert("Impossibile reperire il Pdf", "Pdf")
         }

    });
        $$('.doc-info_email').on('click', function (e) {
            myApp.showPreloader('Invio mail');
            var title=e.currentTarget.getAttribute("data-doc_title");
            var keyDoc_RF = e.currentTarget.getAttribute("data-KeyDoc_RF");
            var linkUrlDocumento_SP = e.currentTarget.getAttribute("data-LinkUrlDocumento_SP");
            setTimeout(function () { sendDocument(keyDoc_RF, linkUrlDocumento_SP,title) }, 1000);
            
        });

}
function buildTicketTable(myList, columns, headers, limit, lastIndexDoc) {
    var url;
    var upperLimit =  lastIndexDoc + limit;

    if ($$('.headerTable').length === 0 && myList.length > 0) {
        var headerTr$ = $$('<tr/>');
        for (var i = 0; i < columns.length; i++) {
            headerTr$.append($$('<th class="headerTable"/>').html(headers[i]));
        }
        $$(".data-table > table > thead").append(headerTr$);
    }
    if (myList.length === 0) {
        $$(".data-table > table > thead").empty();
    }

    //console.log('index: '+lastIndexDoc+' limit: '+limit + ' count: ' + myList.length + ' upperLimit: ' + upperLimit);
    for (var i = lastIndexDoc; i < upperLimit && i < myList.length; i++) {
        var row$ = $$('<tr/>');
        var assignment = myList[i].assignment2 ? myList[i].assignment2 : myList[i].assignment1;
        if(!assignment){
            assignment = 'Operatore non disponibile';
        }
        // remove __ to description
        var desc = myList[i].description;
        if(desc && desc.includes("__")){
            var tmp = desc.split("__");
            desc = tmp[0];
        }
        url = "ticket/ticketPage.html?id=" + myList[i].ticketid;
        row$.append($$('<td data-collapsible-title="' + headers[0] + '"/>').html('<a href="'+ url +'" class="button button-fill button-raised yellow">' + myList[i].ticketid + '</a>'));
//        row$.append($$('<td data-collapsible-title="' + headers[1] + '"/>').html('<a href="'+ url +'" class="doc-info_title">' + myList[i].externalsystem + '</a>'));
        row$.append($$('<td data-collapsible-title="' + headers[1] + '"/>').html('<a href="'+ url +'" class="doc-info_title">' + desc + '</a>'));
         if(myList[i].status === "RESOLVED"){
            row$.append($$('<td data-collapsible-title="' + headers[2] + '"/>').html('<a href="'+ url +'" class="doc-info_title" style="font-weight: bold; color: #ffc107;">' + myList[i].status + '</a>'));
        }else{
            row$.append($$('<td data-collapsible-title="' + headers[2] + '"/>').html('<a href="'+ url +'" class="doc-info_title">' + myList[i].status + '</a>'));
        }
        row$.append($$('<td data-collapsible-title="' + headers[3] + '"/>').html('<a href="'+ url +'" class="doc-info_title">' + myList[i].reportedby + '</a>'));
        row$.append($$('<td data-collapsible-title="' + headers[4] + '"/>').html('<a href="'+ url +'" class="doc-info_title">' + assignment + '</a>'));
        row$.append($$('<td data-collapsible-title="' + headers[5] + '"/>').html('<a href="'+ url +'" class="doc-info_title">' + formatDateFromTimeStampToItalian(myList[i].creationdate) + '</a>'));
        $$(".data-table > table > tbody").append(row$);
    }
    filteredList = undefined;
}

function searchDocWithFilters(docAmountFrom, docAmountTo, dateFrom, dateTo, docContains, docType, limit, lastIndexDoc) {

    docTableData = getDocumentList(docAmountFrom,docAmountTo, dateFrom, dateTo, docContains, docType);
    // DOC in ordine desc
    docTableData.sort(function(a,b) {
        return new Date(b.DataDocumento).getTime() - new Date(a.DataDocumento).getTime() ; 
    });
    if(docTableData){
        var documentCount = docTableData.length;
        buildDocumentTable(docTableData, ['Numero', 'Tipo Documento', 'Data','Importo', 'E-mail', 'PDF'], limit, lastIndexDoc);
        if(documentCount || documentCount === 0){
            $$('.docCount').text(documentCount);
            $$('.documentSearchCount').show();
            $('.page-content').animate({scrollTop: 330}, 500);
        }
    }else{
       return;
    }
}



function toFilterTickets(dateFrom, dateTo, status, desc){
    dateFrom = (dateFrom === "") ? '1970-01-01' : dateFrom;
    dateTo = (dateTo === "") ? '2049-01-01' : dateTo;
    var descIfExist = '';
    if(desc !== ''){
       descIfExist  = 'and description="%'+desc+'%"';
    }

    var stringFilters = 'oslc.pageSize='+pageSizeFilterTickets+'&oslc.orderBy=-changedate&oslc.select=*&oslc.where=reportedby="'+window.sessionStorage.personid+'" and creationdate>="'+dateFrom+'" and creationdate<="'+dateTo+'" and status="'+status+'"'+descIfExist;
    
    return stringFilters;
}

function formatDateFromItalian(date) {

    var finalDate = '';
    if (date && date !== 'null') {
        var dateArray = date.split("/");
        finalDate = "" + dateArray[2] + "-" + dateArray[1] + "-" + dateArray[0] + "";
    }
    return finalDate;

}
function formatDateFromTimeStampToItalian(timeStamp) {

    var finalDate = 'Data non disponibile';
    if (timeStamp && timeStamp !== 'null') {
        var d= new Date(timeStamp);
        finalDate = ("0" + d.getDate()).slice(-2) + '/' + ("0" + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
    }
    return finalDate;
}
function formatDateFromTimeStampToUSA(timeStamp) {
    var finalDate = 'Data non disponibile';
    if (timeStamp && timeStamp !== 'null') {
        var d= new Date(timeStamp);
        finalDate = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
    }
    return finalDate;
}

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    // create a view into the buffer
    var ia = new Uint8Array(ab);
    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
}
function populateTicketPageDetails(ticket){
   
    var assignment = ticket.assignment2 ? ticket.assignment2 : ticket.assignment1;
      if(!assignment){
          assignment = 'Operatore non disponibile';
      }
        var desc = ticket.description ? ticket.description.replace(/<[^>]+>/igm, '').trim() : "Non disponibile";
        if(desc && desc.includes("__")){
            var tmp = desc.split("__");
            desc = tmp[0];
        }
    
    $$(".hrefTicketId").val(ticket.href);
    $$(".textAreaRichiestaTkt").val(desc);
    $$(".textAreaDettagliTkt").val(ticket.description_longdescription ? ticket.description_longdescription.replace(/<[^>]+>/igm, '').trim() : "Dettaglio ticket non disponibile");
    $$(".statusTkt input").val(ticket.status ? ticket.status : "Status non disponibile");
    $$(".operatoreTkt input").val(assignment);
    $$(".textAreaSoluzioneTkt").val(ticket.fr2code_longdescription  ? ticket.fr2code_longdescription.replace(/<[^>]+>/igm, '').trim()  : "Dettaglio risoluzione non disponibile");
    
    $$(".sr-notaText").html(ticket.nota  ? ticket.nota.replace(/<[^>]+>/igm, '').trim()  : "Nota non disponibile");
    
    if((ticket.val1 || ticket.val2 || ticket.cordialita) && ticket.status === 'RESOLVED'){
        $$("#btn-valuta-ticket").hide();
        $$(".valutazioneTkt").hide();
        myApp.alert("Ticket già valutato","Attenzione");

    }

    //Only for canceled tickets
    if(ticket.status === 'ANNULLATO'){
        $$(".sr-notaTkt").css('display', 'block');
    }
    

    if(ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED'){
        $$(".soluzioneTicket").hide();
    }
    
    if(ticket.status !== 'RESOLVED'){
        $$(".valutazioneTkt").hide();
        $$("#btn-valuta-ticket").hide();
    }
}

function prepareEval(){
    var hrefTicket = $$(".hrefTicketId").val();
    var valutazioneTempistica = parseInt($$('input[name=tempistica]:checked').val());
    var valutazioneSoluzione = parseInt($$('input[name=soluzione]:checked').val());
    var valutazioneCortesia = parseInt($$('input[name=cortesia]:checked').val());
    if((valutazioneCortesia < 3 || valutazioneSoluzione < 3 || valutazioneTempistica < 3) && $$(".notaValutazione textarea").val() === ''){   
        myApp.alert("Inserisci una nota di valutazione","Nota Valutazione");
        $$(".notaValutazione").css("display","block");
        myApp.hidePreloader();
        return;
    }else{
        var notaValutazione= $$(".notaValutazione textarea").val();
        sendEval(valutazioneTempistica, valutazioneSoluzione, valutazioneCortesia, notaValutazione, hrefTicket);
    }
}
 
function blockAfterEval(){

        $$(".valutazioneTkt input").attr({
            'disabled': true,
            'readonly': true
        });
        $$(".notaValutazione textarea").attr({
          'disabled': true,
          'readonly': true
        });
        $$("#btn-valuta-ticket").hide();
}

function setUserProfile(data){
    var stringGroup = "groupname";
    var groupArray = [];
    $$.each(data, function(key,value){
        if(key.indexOf(stringGroup) !== -1){
            groupArray.push(value.toLowerCase());
        }
    });
    
   window.sessionStorage.setItem("userProfile", groupArray);
}
function isInArray(gruppi, gruppo) {
    return gruppi.split(",").indexOf(gruppo.toLowerCase()) > -1;
}
function verifyUserProfile(){
       if(!isInArray(window.sessionStorage.userProfile,"ammin") && !isInArray(window.sessionStorage.userProfile,"super_doc")){
            $$(".richiestaDocumenti").hide();
        }else{
            $$(".richiestaDocumenti").show();
        }

        if(!isInArray(window.sessionStorage.userProfile,"ticket")){
            $$(".gestioneTicket").hide();
        }else{
            $$(".gestioneTicket").show();
        }
        if(!isInArray(window.sessionStorage.userProfile,"controllori")){
            $$(".gestioneControlli").hide();
        }else{
            $$(".gestioneControlli").show();
        }
        if(!isInArray(window.sessionStorage.userProfile,"sicurezza_patrimoniale")){
            $$(".gestionePlichi").hide();
        }else{
            $$(".gestionePlichi").show();
        }
}

function formatAmountToFloat(amount){
    var amountFixed2 = "Non Disponibile";
    var tmp = parseFloat(amount);
    if(tmp){
        amountFixed2 = tmp.toFixed(2);
    }
    return amountFixed2;
}

function populatePuntiVendita(){
    var jsonPuntiVendita = JSON.parse(window.sessionStorage.getObj("puntiVendita"));
  
    if($('.puntiVenditaIspezioneSelect').length > 0){
        $.each(jsonPuntiVendita, function (i, pv) {
            $('.puntiVenditaIspezioneSelect').append($('<option>', { 
                value: pv.idPdv,
                text : pv.codicePdv+" - "+pv.localita
            }));
        });
    }
    
       // popolo la select della ricerca plichi
    if($('.puntiVenditaPlicoChiaviSelect').length > 0){
        $.each(jsonPuntiVendita, function (i, pv) {
            $('.puntiVenditaPlicoChiaviSelect').append($('<option>', { 
                value: pv.idPdv,
                text : pv.codicePdv+" - "+pv.localita
            }));
        });
    }
    if($('.puntiVenditaPlicoChiaviSelectCreate').length > 0){
        $.each(jsonPuntiVendita, function (i, pv) {
            $('.puntiVenditaPlicoChiaviSelectCreate').append($('<option>', { 
                value: pv.idPdv,
                text : pv.codicePdv+" - "+pv.localita
            }));
        });
    }
}
function populateTipiEvento(){
    var jsonTipiEvento = JSON.parse(window.sessionStorage.getObj("tipiEvento"));
    $.each(jsonTipiEvento, function (i, te) {
    $('.tipoIspezioneSelect').append($('<option>', { 
        value: te.idTipoEvento,
        text : te.descrizione
    }));
});
}

function prepareSubmitIspezioneHeader(){
    
    var commenti = $$(".commentiIspezioneText").val() ? $$(".commentiIspezioneText").val() : 'Nessun Commento';
    var controllore = window.sessionStorage.username;
    var dataIspezione = formatDateFromTimeStampToUSA(new Date().getTime());
    var presenti = $$(".presentiIspezioneText").val() ? $$(".presentiIspezioneText").val() : 'Non specificato';
    var tipoEvento = parseInt($$(".tipoIspezioneSelect").val());
    var puntoVendita = parseInt($$(".puntiVenditaIspezioneSelect").val());
   
    sendIspezioneHeader(commenti,controllore,dataIspezione,presenti,tipoEvento,puntoVendita);
}

function populateInfoIspezione(info){
    $$(".submitIspezioneHeader").addClass("displaynone");
    $$(".info.row").removeClass("displaynone");
    $$(".idIspezione").text(info.idIspezione);
    $$(".userIspezione").text(info.controllore);
    $$(".dataIspezione").text(formatDateFromTimeStampToItalian(info.dataIspezione));
    
    // RENDO DISABLED LA SELECT PUNTO VENDITA E IL TIPO EVENTO
    $$(".puntiVenditaIspezione select").attr({
            'disabled': true,
            'readonly': true
    });
      $$(".tipoIspezione select").attr({
            'disabled': true,
            'readonly': true
    });
    
}
function populateControlli(controlliObj, status){
    
    
    if($$(".submitIspezioneDettaglio")){
          $$(".submitIspezioneDettaglio").removeClass("displaynone");
    }
     if($$(".submitIspezioneDettaglioInvia")){
          $$(".submitIspezioneDettaglioInvia").removeClass("displaynone");
    }
    // rendo visibile la parte degli allegati
     $$(".divDocContainer").removeClass("displaynone");
      $$(".divImgContainer").removeClass("displaynone");
    // ordino per sequenza 
    var controlliObjSort = controlliObj.sort(function(a,b) {
        return a.seq - b.seq ; 
    });
    
    

    var myListControlli = myApp.virtualList('.list-block.virtual-list.ispezioneList', {
    // Array with items data
    items: controlliObjSort ,
    height:98,
    // Template 7 template to render each item
    template: '<li class="item-content">' +
                  '<div class="item-inner-row">' +
                      '<div class="item-title-row">' +
                        '<div class="item-subtitle">{{controllo.ambito.descrizione}}</div>' +
                      '</div>' +
                      '<div class="item-title">{{controllo.descrizione}}</div>' +
                      '<div class="item-input-row">' +
                      '<a href="#" data-descrizioneControllo="{{controllo.descrizione}}" class="prompt-ok "><input readonly="true" type="text" style="color: #a5a1a1;"  class="commentoIdControllo{{controllo.idControllo}} " name="commenti" placeholder="Inserisci commento"></a>' +
                  '</div>' +
                   '</div>' +
                  '<div class="item-input-row">' +
                  '<select onchange="verifyResult(this)" data-idControllo="{{controllo.idControllo}}" class="controlloIsp"><option value="">Esito</option><option value="C">Conforme</option><option value="N">Non conforme</option></select>' +    
                      '</div>' +
                    '</div>' +
               '</li>'
    });     
     $$('.prompt-ok').on('click', function (e) {
        if(status === "I"){
            return;
        }
        var elem = e.currentTarget.firstChild;
        var titoloControlloDescrizione = e.currentTarget.dataset.descrizionecontrollo;
        var valueDefault = elem.value ? elem.value : "";
       myApp.modal({
            title: titoloControlloDescrizione,
            text: "",
            afterText: '<input type="text" class="modal-text-input" placeholder="Inserisci commento" value="'+valueDefault+'" />',
            buttons: [{
              text: 'Conferma',
              onClick: function(e) {
                elem.value = $$(".modal-text-input").val();
              }
            }, {
              text: 'Cancella',
              onClick: function() {
               elem.value ="";
              }
            }, ]
          }); 

          });


}

function prepareSubmitIspezioneDettaglio(status){
    var idIspezione = $$(".idIspezione").text();
    var arrayJson = [];
     var okControlli = "ok";
        $$(".controlloIsp").each(function(index){
            if($$(this).val() === "")
                okControlli = "";
        });
    if(okControlli || status === "B"){
          $$(".controlloIsp").each(function (index){
            var obj = new Object();
            obj.ispezione = {idIspezione: idIspezione};
            obj.controllo = {idControllo: $$(this).data("idControllo")};
            obj.esito = $$(this).val();
            if(!obj.esito){
                obj.esito = " ";
            }
            var commento = $$(".commentoIdControllo"+$$(this).data("idControllo")+"").val();
            obj.commento = commento;
            if(obj.esito === "N"){ 
                obj.dataLimite = formatDateFromItalian($$(".dataLimiteEvento-"+$$(this).data("idControllo")+"").val());
            }
            arrayJson.push(obj);
        });
    }else{
        if(status === "I"){
            myApp.hidePreloader();
            myApp.alert("Valuta tutti i controlli", "Attenzione");
            return;
        }
           
    }
    var commenti = $$(".commentiIspezioneText").val() ? $$(".commentiIspezioneText").val() : 'Nessun Commento';
    var controllore = window.sessionStorage.username;
    var dataIspezione = formatDateFromTimeStampToUSA(new Date().getTime());
    var presenti = $$(".presentiIspezioneText").val() ? $$(".presentiIspezioneText").val() : 'Non specificato';
    var tipoEvento = parseInt($$(".tipoIspezioneSelect").val());
    var puntoVendita = parseInt($$(".puntiVenditaIspezioneSelect").val());
    submitIspezioneDettaglio(status,arrayJson, commenti,controllore,dataIspezione,presenti,tipoEvento,puntoVendita);

}

function prepareRicercaIspezioni(){
    
    // compongo la stringa per l'URL
    var variableFilters = "";
    
    var dateFromIspezioni = formatDateFromItalian($$('.datePickerFrom').val()) ;
    var dateToIspezioni = formatDateFromItalian($$('.datePickerTo').val());
    dateFromIspezioni = (dateFromIspezioni === "") ? '1990-01-01' : dateFromIspezioni;
    dateToIspezioni = (dateToIspezioni === "") ? '2069-01-01' : dateToIspezioni;
    
    
    var status = $$(".filterStatusSelect").val() ? "&status="+$$('.filterStatusSelect').val()+"" :"";
    var tipoEvento = $$(".tipoIspezioneSelect").val() ? "&idTipoEvento="+$$('.tipoIspezioneSelect').val()+""  :"" ;
    var puntoVendita = $$(".puntiVenditaIspezioneSelect").val() ? "&idPuntoVendita="+$$('.puntiVenditaIspezioneSelect').val()+""  :"" ;
    
    variableFilters= "?dateFrom="+dateFromIspezioni+"&dateTo="+dateToIspezioni+""+status+""+tipoEvento+""+puntoVendita+"";
    getIspezioni(variableFilters);
}

function populateListaIspezioni(objIspezioni){
    $$('.tbodyIspezioniList').empty();
   var header =  ['Id', 'Data creazione', 'Tipo evento','Punto vendita', 'Status'];
   if ($$('.headerTable').length === 0 && objIspezioni.length > 0) {
        var headerTr$ = $$('<tr/>');
        for (var i = 0; i < header.length; i++) {
            headerTr$.append($$('<th class="headerTable"/>').html(header[i]));
        }
        $$(".data-table > table > thead").append(headerTr$);
    }
    if (objIspezioni.length === 0) {
        $$(".data-table > table > thead").empty();
    }
    for (var i = 0; i < objIspezioni.length; i++) {
        var row$ = $$('<tr/>');
       var status = ""
        if(objIspezioni[i].status === "B"){
            status = "Salvata";
        }else if (objIspezioni[i].status === "I"){
            status = "Inviata";
        }
        
        // se lo status è inviata  allora faccio al click sull'id apro il PDF e non il dettaglio
        if(objIspezioni[i].status === "I"){
            row$.append($$('<td data-collapsible-title="' + header[0] + '"/>').html('<a onclick="openPdfIspezione('+objIspezioni[i].idIspezione+')" class="idIspezioneList button button-fill button-raised yellow">' + objIspezioni[i].idIspezione + '</a>'));
        }else{
            row$.append($$('<td data-collapsible-title="' + header[0] + '"/>').html('<a href="controlli/edit_ispezione.html?id='+ objIspezioni[i].idIspezione +'&status='+objIspezioni[i].status+'" class="idIspezioneList button button-fill button-raised yellow">' + objIspezioni[i].idIspezione + '</a>'));
        }
        row$.append($$('<td data-collapsible-title="' + header[1] + '"/>').html('<a href="#" class="dataIspezioneList">' + formatDateFromTimeStampToItalian(objIspezioni[i].dataIspezione) + '</a>'));
        row$.append($$('<td data-collapsible-title="' + header[2] + '"/>').html('<a href="#" class="tipoIspezioneList">' + objIspezioni[i].tipoEvento.descrizione + '</a>'));
        row$.append($$('<td data-collapsible-title="' + header[3] + '"/>').html('<a href="#" class="puntoVenditaIspezioneList">' + objIspezioni[i].puntoVendita.localita + '</a>'));
        row$.append($$('<td data-collapsible-title="' + header[4] + '"/>').html('<a href="#" class="statusIspezioneList">' + status + '</a>'));
        $$(".data-table > table > tbody").append(row$);
        
    }
    
}
 function populateIspezioneDetails(objIspezione){
    //POPOLO LE INFO
    $$(".idIspezione").text(objIspezione.idIspezione);
    $$(".userIspezione").text(objIspezione.controllore);
    $$(".dataIspezione").text(formatDateFromTimeStampToItalian(objIspezione.dataIspezione));
    
    // POPOLO LA TESTATA
    var status = "";
        if(objIspezione.status === "B"){
            status = "Salvata";
        }else if (objIspezione.status === "I"){
            status = "Inviata";
        }
     $$(".tipoEvento").text(objIspezione.tipoEvento.descrizione);
     $$(".commentiIspezioneText").text(objIspezione.commenti);
     $$(".presentiIspezioneText").text(objIspezione.presenti);
     $$(".puntoVendita").text(objIspezione.puntoVendita.codicePdv+" - "+objIspezione.puntoVendita.localita);
     $$(".statusIsp").text(status);
     
     // setto in un input hidden i campi tipo evento e punto vendita
    $(".tipoIspezioneSelect").val(objIspezione.tipoEvento.idTipoEvento);
    $(".puntiVenditaIspezioneSelect").val(objIspezione.puntoVendita.idPdv);
     

    // itero i dettagli ispezioni
    $.each(objIspezione.dettaglioIspezione, function (i, di) {
        var selectElement = $("select[data-idControllo="+di.controllo.idControllo+"]");
       $("select[data-idControllo="+di.controllo.idControllo+"]").val(di.esito.trim());
       $(".commentoIdControllo"+di.controllo.idControllo+"").val(di.commento);
       if(di.esito === "N" && (di.dataLimite !== null && typeof di.dataLimite !== 'undefined')){
           var siebling = selectElement.parent().siblings();
           $(siebling).append('<div class="item-input-row"><input readonly="true" type="text" value="'+formatDateFromTimeStampToItalian(di.dataLimite)+'" style="color: red;" class="dataLimiteEvento-'+di.controllo.idControllo+'" ></div>');
       }
    });
    
    if(objIspezione.status === "I"){
        disableInputEditIspezione();
        $$(".submitIspezioneDettaglio").addClass("displaynone");
    }else if (objIspezione.status === "B"){
        $$(".sendIspezione").removeClass("displaynone");
    }
    // rendo visibile la parte degli allegati
     $$(".divDocContainer").removeClass("displaynone");
      $$(".divImgContainer").removeClass("displaynone");
       if(objIspezione.allegatiIspezione && objIspezione.allegatiIspezione.length > 0){
        $(".fileAllegatiPre").removeClass("displaynone");
        
        for(var i = 0; i < objIspezione.allegatiIspezione.length; i++){
            var fileAllegato = "";
            try{
                fileAllegato = objIspezione.allegatiIspezione[i].pathAllegato;
                fileAllegato = fileAllegato.split("/");
                fileAllegato = fileAllegato[fileAllegato.length - 1];
            }catch (exception) {
                fileAllegato = "Nome del file non disponibile";
            }

            $(".fileAllegatiPre").append("<p>"+fileAllegato+"</p>");
        }
    }else{
        $(".fileAllegatiPre").addClass("displaynone");
    }
 }
 
 function disableInputEditIspezione(){
     $$(".editIspezione select").attr({
            'disabled': true,
            'readonly': true
    });
    $$(".editIspezione input").attr({
            'disabled': true,
            'readonly': true
    });
    $$(".editIspezione textarea").attr({
            'disabled': true,
            'readonly': true
    });
 }
 
 function prepareSaveAttach(){
  
     var idIspezione =  $$(".idIspezione").text();
     var formData1 = new FormData();
     var formDatalIsPopulated = false;
     
      if($$(".file-to-upload").length>0){
        
        for(var i = 0; i < $$(".file-to-upload").length; i++){
             if($$(".file-to-upload")[i].files.length>0){
                var prefix = Math.round(new Date().getTime()/1000) + '___' ;
                formData1.append("file",$$(".file-to-upload")[i].files[0], prefix+$$(".file-to-upload")[i].files[0].name);
                formDatalIsPopulated = true;
            }
        }        
     }
        
      if($$('.small-imageMulti').length > 0){
          for(var i = 0; i < $$('.small-imageMulti').length; i++){
              if( $$('.small-imageMulti').eq(i).attr('src')!=='' ){
                  var prefix = Math.round(new Date().getTime()/1000) + '___' ;
                  var img = $$('.small-imageMulti').eq(i).attr('src');
                  var imgdatafile = dataURItoBlob(img);
                  var imageName = prefix+"photoIspezione"+[i]+".jpg";
                  formData1.append("file", imgdatafile, imageName);
                  formDatalIsPopulated = true;
              }
          }
      }
      
    // se ho almeno un file tra img e file caricatri allora invio  
    if(formDatalIsPopulated){
            saveAttach(formData1, idIspezione);
    }else{
        myApp.hidePreloader();
    }

}
       

function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}
function savebase64AsPDF(folderpath,filename,content,contentType){
    // Convert the base64 string in a Blob
    var DataBlob = b64toBlob(content,contentType);
    
    console.log("Starting to write the file :3");
    
    window.resolveLocalFileSystemURL(folderpath, function(dir) {
        
        console.log("Access to the directory granted succesfully");
		dir.getFile(filename, {create:true}, function(file) {
            console.log("File created succesfully.");
           
            file.createWriter(function(fileWriter) {
                console.log("Writing content to file");
                
                fileWriter.write(DataBlob);
            }, function(){
                alert('Unable to save file in path '+ folderpath);
            });
		});
    });
}

function addFileInput(element){
    var numero = parseInt($(element).attr("data-numero")) + 1;
    var valueInput =  $(element).val().replace(/C:\\fakepath\\/i, '');
    $(element).addClass("sposta");
    var label = '<div class="rowFile"><span data-numero="'+(numero-1)+'"  class="file-label">'+valueInput+'<i class="f7-icons customDelete" onclick="deleteFile('+(numero-1)+')">close</i></span></div>';
    var el = '<input type="file" name="file-to-upload" class="file-to-upload" data-numero="'+numero+'"  onchange="addFileInput(this)"/>';
    $(".listFiles").append($(label));
    $(".fileContainer").append($(el));
}
 
function deleteFile(numero){
    if(numero === 1){
        $('span[data-numero="'+numero+'"]').parent().remove();
        $('input[data-numero="'+numero+'"]').val("");
        
        if($$('input.file-to-upload').length === 2){
            $('.file-to-upload:not(input[data-numero="'+numero+'"])').remove();
            $$('input[data-numero="'+numero+'"]').removeClass("sposta");
        }
            
    }else{
        $('span[data-numero="'+numero+'"]').parent().remove();
        $('input[data-numero="'+numero+'"]').remove();
        if($('input.file-to-upload').length === 2){
            $('.file-to-upload:not(input[data-numero="1"])').remove();
            $('input[data-numero="1"]').removeClass("sposta");
        }
    }
}

function deleteImg(numeroImg){
    $("div.imgContent[data-numeroimg='"+numeroImg+"']").remove();
}

function openPdfIspezione(idIspezione){;
    
                var linkPdf = TEST_URL+"/GabrielliAppV2WS/rest/pdf/get/"+idIspezione+"?jSessionID="+window.sessionStorage.jsessionid;
				if(typeof device == 'undefined'){
					window.open(linkPdf, '_blank', 'location=yes'); 
					return;
				}
                myApp.showPreloader();
                var fileURL = testPathCustom+idIspezione+".pdf";
                var myBase64 = "";
                convertFileToDataURLviaFileReader(encodeURI(linkPdf),function(base64Img) {
                myBase64 = base64Img.split(',')[1];    
               
                // To define the type of the Blob
                var contentType = "application/pdf";
                // if cordova.file is not available use instead :
                // var folderpath = "file:///storage/emulated/0/";
                var folderpath = testPathCustom;
                
                var filename = idIspezione+".pdf";

                savebase64AsPDF(folderpath,filename,myBase64,contentType);
                
                setTimeout(function () {
                    cordova.plugins.fileOpener2.open(
                    fileURL, 
                    "application/pdf",
                    { error : function(e) { 
                        myApp.hidePreloader();
                        myApp.alert("Errore","Impossibile aprire il pdf");
                        },
                     success : function(e) { 
                        myApp.hidePreloader();
                        
                        }
                    });
                }, 4000);
               
                    });   
}

function verifyResult(selectElement){
     var siebling = selectElement.parentNode.previousSibling;
    if($(selectElement).val() === "N"){
       
     myApp.modal({
            title: "Selezionare una data",
            text: "Selezionare una data limite entro la quale l'evento dovrà essere reso conforme",
            afterText: '<input type="text" class="modal-text-input calendar" placeholder="Inserisci data" value="" />',
            buttons: [{
              text: 'Conferma',
              onClick: function() {
                $(siebling).append('<div class="item-input-row"><input readonly="true" type="text" value="'+$(".calendar").val()+'" style="color: red;" class="dataLimiteEvento-'+selectElement.dataset.idcontrollo+'" ></div>');
              }
            }, {
              text: 'Cancella',
              onClick: function() {
               $(selectElement).val("");
              }
            }, ]
          }); 
        
      var myCalendarLimit = myApp.calendar({
        input: '.calendar',
        dateFormat: 'dd/mm/yyyy',
        closeOnSelect: true,
        monthNames: months,
        dayNamesShort: days,
        minDate: new Date()
       
        });
        
    
    }else{
        $(".dataLimiteEvento-"+selectElement.dataset.idcontrollo).remove();
    }
}

function populateDipendentiFromPdv(data){
        if($('.dipendentiPlicoSelect').length > 0){
            //SVUOTO LE OPTION DELLA SELECT E FACCIO VISUALIZZARE LA LABEL DI DEFAULT TUTTI I DIPENDENTI
            $('.dipendentiPlicoSelect option').remove();
            $('.dipendentiPlicoSelect').val("");
            $('.dipendentiPlicoSelect').append($('<option value="">Tutti i dipendenti</option>'));
            $('.dipendentiPlicoSelect').siblings().find(".item-after").text("Tutti i dipendenti");
            $.each(data, function (i, d) {
                $('.dipendentiPlicoSelect').append($('<option>', { 
                    value: d.idDipendente,
                    text : d.nome+" "+d.cognome
                }));
            });
            $('.linkRicercaDipendenti').removeClass("disabled");
            $('.submitRicercaPlichi').removeClass("disabled");
    }
    
}
function populateDipendentiFromPdvCreatePlico(data){
        if($('.dipendentiPlicoSelectCreate').length > 0){
            //SVUOTO LE OPTION DELLA SELECT E FACCIO VISUALIZZARE LA LABEL DI DEFAULT TUTTI I DIPENDENTI
            $('.dipendentiPlicoSelectCreate option').remove();
            $('.dipendentiPlicoSelectCreate').val("");
            $('.dipendentiPlicoSelectCreate').append($('<option value="">Selez.re un dipendente</option>'));
            $('.dipendentiPlicoSelectCreate').siblings().find(".item-after").text("Selez.re un dipendente");
            $.each(data, function (i, d) {
                $('.dipendentiPlicoSelectCreate').append($('<option>', { 
                    value: d.idDipendente,
                    text : d.nome+" "+d.cognome
                }));
            });
            $('.linkRicercaDipendentiCreate').removeClass("disabled");
   
    }
    
}


function prepareRicercaPlichi(){
    var idPdv = $$('.puntiVenditaPlicoChiaviSelect').val() ? $$('.puntiVenditaPlicoChiaviSelect').val() : 0;
    var idDipendente = $$('.dipendentiPlicoSelect').val() ? $$('.dipendentiPlicoSelect').val() : 0;
    var reverse = false;
    var pageSize = 500;
    var key="validitaA";
    
    var objQueryParam = {
        'firstResult': '0', 'pageSize': pageSize, 'sortKey': key, 'reverse' : reverse, 'selectedPuntoVendita' : idPdv, 'selectedDipendente' : idDipendente
    };
    
    getListaPlichi(objQueryParam);
}


function populateListaPlichi(objPlichi){
    $$('.tbodyListaPlichi').empty();
   var header =  ['Id plico','Descrizione' ,'Inizio Validità', 'Fine Validità','Dipendente', 'Punto vendita'];
   if ($$('.headerTable').length === 0 && objPlichi.length > 0) {
        var headerTr$ = $$('<tr/>');
        for (var i = 0; i < header.length; i++) {
            headerTr$.append($$('<th class="headerTable"/>').html(header[i]));
        }
        $$(".data-table > table > thead").append(headerTr$);
    }
    if (objPlichi.length === 0) {
        $$(".data-table > table > thead").empty();
        myApp.alert("Nessun plico trovato","Ricerca plichi");
    }
    for (var i = 0; i < objPlichi.length; i++) {
        var row$ = $$('<tr/>');
        row$.append($$('<td data-collapsible-title="' + header[0] + '"/>').html('<a href="plicoChiavi/detailPlico.html?idPlico='+ objPlichi[i].idPlico +'" class="idPlicoList button button-fill button-raised yellow">' + objPlichi[i].idPlico + '</a>'));
        row$.append($$('<td data-collapsible-title="' + header[1] + '"/>').html('<a href="#" class="plicoDescrizione">' + objPlichi[i].descrizione + '</a>'));
        row$.append($$('<td data-collapsible-title="' + header[2] + '"/>').html('<a href="#" class="plicoValiditaDa">' + formatDateFromTimeStampToItalian(objPlichi[i].validitaDa) + '</a>'));
        row$.append($$('<td data-collapsible-title="' + header[3] + '"/>').html('<a href="#" class="plicoValiditaA">' + formatDateFromTimeStampToItalian(objPlichi[i].validitaA) + '</a>'));
        row$.append($$('<td data-collapsible-title="' + header[4] + '"/>').html('<a href="#" class="plicoDipendente">' + objPlichi[i].dipendente.cognome + ' '+objPlichi[i].dipendente.nome+'</a>'));
        row$.append($$('<td data-collapsible-title="' + header[5] + '"/>').html('<a href="#" class="plicoPdv">' + objPlichi[i].puntoVendita.denominazione + '</a>'));
        
        
        $$(".data-table > table > tbody").append(row$);
        
    }
    
    
}

function populateDetailsPlico(objPlico){
    
    $$(".idPlicoClass").text(objPlico.idPlico);
    $$(".puntoVenditaPlico").text(objPlico.puntoVendita.denominazione);
    $$(".dipendentiPlicoSpan").text(objPlico.dipendente.cognome + " " + objPlico.dipendente.nome);
    $$(".datePlicoDa").text(formatDateFromTimeStampToItalian(objPlico.validitaDa));
    $$(".datePlicoA").text(formatDateFromTimeStampToItalian(objPlico.validitaA));
    
    
    
    //populate tabella chiavi
    var header =  ['Id chiave','Descrizione'];
    if ($$('.headerTable').length === 0 && objPlico.chiavi.length > 0) {
        var headerTr$ = $$('<tr/>');
        for (var i = 0; i < header.length; i++) {
            headerTr$.append($$('<th class="headerTable"/>').html(header[i]));
        }
        $$(".data-table > table > thead").append(headerTr$);
    }
    if (objPlico.chiavi.length === 0) {
        $$(".data-table > table > thead").empty();
        
    }
    for (var i = 0; i < objPlico.chiavi.length; i++) {
        var row$ = $$('<tr/>');
        row$.append($$('<td data-collapsible-title="' + header[0] + '"/>').html('<a href="#" class="plicoId">' + objPlico.chiavi[i].idChiave + '</a>'));
        row$.append($$('<td data-collapsible-title="' + header[1] + '"/>').html('<a href="#" class="plicoDescrizione">' + objPlico.chiavi[i].descrizione + '</a>'));
        $$(".data-table > table > tbody").append(row$);
    }
}

function addPlicoKey(){
     myApp.prompt('Inserisci la descrizione della chiave',' Nuova chiave', function (value) {
            if(value){
                var nuovaChiaveChips =   '<div class="chip">'
                                            +'<div class="chip-label chipKeyValue">'+value+'</div><a href="#" onclick="deleteKey(this);" class="chip-delete deleteCustom"></a>'
                                         +'</div>';
                $('.containerListaChiavi').append($(nuovaChiaveChips));    
            }       
        }); 
}

function deleteKey(chip){
        var keyChip =$$(chip);
        myApp.confirm("Vuoi cancellare la chiave: <b>" + keyChip.parent().text() + "</b> ?", 'Cancellazione chiave', function() {
            keyChip.parent().remove();
        });
}
function populateEditPlico(objPlico){
    $$(".idPlicoClass").text(objPlico.idPlico);
    $$(".puntoVenditaPlicoEdit").text(objPlico.puntoVendita.denominazione);
    $(".puntoVenditaPlicoEdit").data("idPuntoVendita",objPlico.puntoVendita.idPdv);
    $$(".descrizionePlicoEdit").text(objPlico.descrizione);
    $$(".datePlicoDa").val(formatDateFromTimeStampToItalian(objPlico.validitaDa));
    $$(".datePlicoA").val(formatDateFromTimeStampToItalian(objPlico.validitaA));
    
    getDipendentiFromPdv(objPlico.puntoVendita.idPdv, "editPlico");
    $.each($('.dipendentiPlicoSelectEdit option'), function (i, d){
            if(objPlico.dipendente.idDipendente === parseInt(d.value)){
                $(d).attr("selected",true);
            }
    });
    $(".dipendentiPlicoSelectEdit").parent().find('.item-after').text($(".dipendentiPlicoSelectEdit").find("option:selected").text());
    
     $.each(objPlico.chiavi, function (i, d){
          var nuovaChiaveChips =   '<div class="chip">'
                                            +'<div class="chip-label chipKeyValue">'+d.descrizione+'</div><a href="#" onclick="deleteKey(this);" class="chip-delete deleteCustom"></a>'
                                         +'</div>';
        $$(".containerListaChiavi").append(nuovaChiaveChips);
    });
    
}

function populateDipendentiFromPdvEdit(dipendenti){
    $.each(dipendenti, function (i, d){
              $('.dipendentiPlicoSelectEdit').append($('<option>' , { 
                  value: d.idDipendente,
                  text : d.nome+" "+d.cognome
              }));
    });
}


function preparePlicoSaveModify(){
    if($$(".dipendentiPlicoSelectEdit").val() === "" && (".chip").length === 0){
        myApp.alert("Controllare di aver selezionato un dipendete e di aver inserito almeno una chiave nel plico","Errore");
        return;
    }
    if(!$$(".datePickerFrom").val() && !$$(".datePickerTo").val()){
        myApp.alert("Controllare di aver selezionato una data valida","Errore");
        return;
    }
    
    var chiaviPlicoList = [];
    
    $.each($$(".chipKeyValue"), function (i, d){ 
        chiaviPlicoList.push({ 
	        "descrizione" : d.textContent
	});
    });
    
    var data = {
                idPlico: parseInt($$(".idPlicoClass").text()),
                puntoVendita: { idPdv: $(".puntoVenditaPlicoEdit").data().idPuntoVendita },
                descrizione:  $$(".descrizionePlicoEdit").text(),
                chiavi: chiaviPlicoList,
                validitaDa: new Date(formatDateFromItalian($$(".datePickerFrom").val())),
                validitaA: new Date(formatDateFromItalian($$(".datePickerTo").val())),
                dipendente: { idDipendente: parseInt($$(".dipendentiPlicoSelectEdit").val()) }
		};
    updatePlico(data);
                
}

function prepareCreatePlico(){
     if($$(".dipendentiPlicoSelectEdit").val() === "" && (".chip").length === 0){
        myApp.alert("Controllare di aver selezionato un dipendete e di aver inserito almeno una chiave nel plico","Errore");
        return;
    }
    if(!$$(".datePickerFrom").val() && !$$(".datePickerTo").val()){
        myApp.alert("Controllare di aver selezionato una data valida","Errore");
        return;
    }
    if(!$$(".descrizionePlicoEditCreate").val()){
        myApp.alert("Controllare di aver inserito una descrizione","Errore");
        return;
    }
        var chiaviPlicoList = [];
    
    $.each($$(".chipKeyValue"), function (i, d){ 
        chiaviPlicoList.push({ 
	        "descrizione" : d.textContent
	});
    });
    
    var data = {
                
                puntoVendita: { idPdv: $$(".puntiVenditaPlicoChiaviSelectCreate").val() },
                descrizione:  $$(".descrizionePlicoEditCreate").val(),
                chiavi: chiaviPlicoList,
                validitaDa: new Date(formatDateFromItalian($$(".datePickerFrom").val())),
                validitaA: new Date(formatDateFromItalian($$(".datePickerTo").val())),
                dipendente: { idDipendente: parseInt($$(".dipendentiPlicoSelectCreate").val()) }
		};
    
    createPlico(data);
}


