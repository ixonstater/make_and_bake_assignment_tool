var global_TEMPLATE = '<li class = \'gift-list-item\'></li>'

var progData = {
    'sendersList': [],
    'recieversList': [],
    'matches': {
        'senders': [],
        'recievers': [],
    }
}


//form functions
function manageInput(text, src){
    let inputList = text.split(',')
    inputList = inputList.filter(elem => elem != '')
    if (src == 'sender'){
        progData.sendersList = progData.sendersList.concat(inputList)
    }
    else if (src == 'reciever'){
        progData.recieversList = progData.recieversList.concat(inputList)
    }
    let parser = new DOMParser()
    let listItems = inputList.map( (i) => {
        let node = parser.parseFromString(global_TEMPLATE, 'text/html').body.childNodes[0]
        node.innerHTML = i
        return node
    })
    return listItems
}

function getElemsFromClick(e){
    let inputTextId
    let appendPointSelector

    if(e.target.id.includes('sender')){
        inputTextId = 'sender-input'
        appendPointSelector = '#senders-list-append-point > ul'
    }
    else if(e.target.id.includes('reciever')) {
        inputTextId = 'reciever-input'
        appendPointSelector = '#recievers-list-append-point > ul'
    }

    return [inputTextId, appendPointSelector]
}

function validateForSubmission(elemId ,text){
    let src = elemId.split('-')[0]

    if(text == ''){
        throw ('You can\' submit an empty name.')
    } else if (src == 'sender' && progData.sendersList.includes(text)){
        throw ('You can\'t submit duplicate names.')
    } else if (src == 'reciever' && progData.recieversList.includes(text)){
        throw ('You can\'t submit duplicate names.')
    }

    text = text.split(',')
    text = text.filter(elem => elem != '')

    if ((new Set(text)).size !== text.length){
        throw ('You can\'t submit duplicate names.')
    }
}

function submitButtonClicked(e){
    let inputTextId
    let appendPointSelector
    [inputTextId, appendPointSelector] = getElemsFromClick(e)
    
    let input = document.getElementById(inputTextId)
    let inputText = input.value
    input.value = ''
    try{
        validateForSubmission(inputTextId, inputText)
    }
    catch (err){
        alert(err)
        return
    }

    let appendPoint = document.querySelector(appendPointSelector)
    let nodes = manageInput(inputText, inputTextId.split('-')[0])
    for (let node of nodes){
        appendPoint.appendChild(node)
    }
}

function clearProgData(src){
    if (src == 'sender'){
        progData.sendersList = []
    }
    else if (src == 'reciever'){
        progData.recieversList = []
    }
}

function clearButtonClicked(e){
    let inputTextId
    let appendPointSelector
    [inputTextId, appendPointSelector] = getElemsFromClick(e)

    let src = inputTextId.split('-')[0]
    let appendPoint = document.querySelector(appendPointSelector)
    clearProgData(src)
    while(appendPoint.firstChild){
        appendPoint.removeChild(appendPoint.firstChild)
    }
}

//match functions

function validateForMatch(){
    if(progData.recieversList.length == 0){
        throw ('There are no recievers.')
    }
    else if (progData.sendersList.length == 0){
        throw ('There are no senders.')
    }
    else if (progData.sendersList.length != progData.recieversList.length){
        throw ('There are not the same number of senders and recievers.')
    }
}

function shuffleArray(arr){
    let newArr = [...arr]
    for (let i = 0; i < newArr.length; i++){
        let j = Math.floor(Math.random() * (i + 1))
        let temp = newArr[i]
        newArr[i] = newArr[j]
        newArr[j] = temp 
    }
    return newArr
}

function makeMatchesData(){
    progData.matches.recievers = shuffleArray(progData.recieversList)
    progData.matches.senders = shuffleArray(progData.sendersList)
    for (let i = 0; i < progData.matches.recievers.length; i++) {
        if(progData.matches.recievers[i] == progData.matches.senders[i]){
            if(progData.matches.recievers.length == 1){
                break;
            }
            else if(i == 0){
                let temp = progData.matches.senders[i]
                progData.matches.senders[i] = progData.matches.senders[i + 1]
                progData.matches.senders[i + 1] = temp
                continue
            }
            let temp = progData.matches.senders[i]
            progData.matches.senders[i] = progData.matches.senders[i - 1]
            progData.matches.senders[i - 1] = temp
        }
    }
}

function makeMatchesDom(){
    let sendersList = progData.matches.senders.map((i) => {
        let elem = document.createElement('li')
        elem.innerHTML = i
        return elem
    })

    let recieversList = progData.matches.recievers.map((i) => {
        let elem = document.createElement('li')
        elem.innerHTML = i
        return elem
    })

    return [sendersList, recieversList]
}

function showMatches(sendersList, recieversList){
    document.querySelector('#match-list-container > table').className = 'page-table'
    let sendersAppendPoint = document.querySelector('#senders-match-list ol')
    let recieversAppendPoint = document.querySelector('#recievers-match-list ol')
    for (let elem of sendersList){
        sendersAppendPoint.appendChild(elem)
    }
    for (let elem of recieversList){
        recieversAppendPoint.appendChild(elem)
    }
}

function matchSubmitButtonClicked(e){
    try{
        validateForMatch()
    }
    catch(err){
        alert(err)
        return
    }
    try{
        clearMatchDom()
        clearMatchProgData()
    }
    catch(err){
        
    }
    makeMatchesData()
    let [sendersList, recieversList] = makeMatchesDom()
    showMatches(sendersList, recieversList)
}

function clearMatchProgData(){
    progData.matches.recievers = []
    progData.matches.senders = []
}

function clearMatchDom(){
    let sendersList = document.querySelector('#senders-match-list ol')
    let recieversList = document.querySelector('#recievers-match-list ol')
    while(sendersList.firstChild){
        sendersList.removeChild(sendersList.firstChild)
    }
    while(recieversList.firstChild){
        recieversList.removeChild(recieversList.firstChild)
    }
}

function hideMatches(){
    document.querySelector('#match-list-container > table').className = 'hidden'
}

function matchClearButtonClicked(e){
    clearMatchDom()
    clearMatchProgData()
    hideMatches()
}

//print functions

function addNamesToDoc(doc){
    let senderOffsetX = 75
    let recieverOffsetX = 175
    let offsetY = 10
    let startY = 20
    let negativeY = 0

    for (let i = 0; i < progData.matches.senders.length; i++){
        let nextY = offsetY * (i + 1) + startY - negativeY
        if (doc.internal.pageSize.height < nextY + 10){
            doc.addPage()
            negativeY = nextY - 10
            nextY = offsetY * (i + 1) + startY - negativeY
        }
        doc.text(senderOffsetX + 10, nextY, `${i + 1}) ${progData.matches.senders[i]}`)
        doc.text(recieverOffsetX + 10, nextY, `${i + 1}) ${progData.matches.recievers[i]}`)
    }
}

function printButtonClicked(e){
    let doc = new jsPDF('landscape')
    let senderOffsetX = 65
    let recieverOffsetX = 165
    doc.setTextColor(0,100,0);
    doc.setFontSize(30)
    doc.text(senderOffsetX, 20, 'Gift Senders')
    doc.text(recieverOffsetX, 20, 'Gift Recievers')

    doc.setFontSize(15)
    doc.setTextColor(200, 0, 0)
    addNamesToDoc(doc)

    doc.output('dataurlnewwindow')
}

function init(){
    document.getElementById('reciever-submit').addEventListener('click', submitButtonClicked)
    document.getElementById('sender-submit').addEventListener('click', submitButtonClicked)
    document.getElementById('reciever-clear').addEventListener('click', clearButtonClicked)
    document.getElementById('sender-clear').addEventListener('click', clearButtonClicked)
    document.getElementById('match-submit').addEventListener('click', matchSubmitButtonClicked)
    document.getElementById('match-clear').addEventListener('click', matchClearButtonClicked)
    document.getElementById('print').addEventListener('click', printButtonClicked)
}

document.addEventListener('DOMContentLoaded', init)

//a,b,c,d,e,f,g,h,i,j,k