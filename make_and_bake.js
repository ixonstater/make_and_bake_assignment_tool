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

function submitButtonClicked(e){
    let inputTextId
    let appendPointSelector
    [inputTextId, appendPointSelector] = getElemsFromClick(e)
    
    let input = document.getElementById(inputTextId)
    let inputText = input.value
    if(inputText == ''){
        return
    }
    input.value = ''

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

function showMatches(matches){
    document.querySelector('#match-list-container > table').className = 'page-table'
}

function matchButtonClicked(e){
    try{
        validateForMatch()
    }
    catch(err){
        alert(err)
    }
    makeMatchesData()
    let [sendersList, recieversList] = makeMatchesDom()
    showMatches(sendersList, recieversList)
}

function clearMatchButtonClicked(e){

}

function init(){
    document.getElementById('reciever-submit').addEventListener('click', submitButtonClicked)
    document.getElementById('sender-submit').addEventListener('click', submitButtonClicked)
    document.getElementById('reciever-clear').addEventListener('click', clearButtonClicked)
    document.getElementById('sender-clear').addEventListener('click', clearButtonClicked)
    document.getElementById('match-submit').addEventListener('click', matchButtonClicked)
    document.getElementById('match-clear').addEventListener('click', clearButtonClicked)
}

document.addEventListener('DOMContentLoaded', init)