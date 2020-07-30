let globalState
var maxCount;
var allTags = {
    "1": "I am single",
    "2": "We stay together",
    "3": " We are a nuclear family",
    "4": "We are a semi-nuclear family",
    "5": "We are a joint family"
}

//updates global Array with selected count
let updateStatus = (id, val) => {
    let index = globalState[0].indexOf(id)
    globalState[1][index] = val
}

//updates tag line for family
let updateTagline = (data) => {
    document.getElementById("tagline").innerHTML = data
}

//triggered once slid bar clicked 
function showVal(event) {
    updateTagline(allTags[event])
    resetCheckBox()
}

//resets all check box to uncheck
let resetCheckBox = () => {
    globalState[0].forEach(element => {
        document.getElementById(element).checked = false
        document.getElementById(element + "-num").options.length = 0
    });
}

//create option based on check box
let createOptions = (id, count) => {
    let select = document.getElementById(id)
    select.options.length = 0;
    for (let index = 0; index < count; index++) {
        var option = document.createElement("option");
        option.value = index + 1
        option.text = index + 1
        if (id != "couple-num") {
            select.appendChild(option)
        } else {
            if ((index + 1) % 2 == 0) {
                select.appendChild(option)
            }
        }
    }
}

//remove the option based on given element's Id
let removeOptionsById=(id)=>{
    document.getElementById(id + "-num").options.length = 0
}

//buble position setter
function setBubble(range, bubble) {
    textHash = {
        "1": "1",
        "2": "2",
        "3": "(3-4)",
        "4": "(5-6)",
        "5": "6+",
    }
    const val = range.value;
    const min = range.min ? range.min : 0;
    const max = range.max ? range.max : 100;
    const newVal = Number(((val - min) * 30) / (max - min));
    bubble.innerHTML = textHash[val];

    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left = `calc(${newVal}% + (${20 - newVal * 0.15}px))`;
}

//sum total count exist in global arr
let findSum=()=>{
    return globalState[1].reduce(function (a, b) {
        return a + b;
    }, 0);
}

//triggeres on change of checkbox
let checkboxChanged = (event) => {
    let index = globalState[0].indexOf(event.target.id)
    var sum = findSum()
    if (event.target.checked) {
        if (event.target.id != "couple" && sum<maxCount) {
            createOptions(event.target.id + "-num", maxCount)
            updateStatus(event.target.id, 1)
        } else if(sum<maxCount){
            if (maxCount - sum >= 2) {
                createOptions(event.target.id + "-num", maxCount)
                updateStatus(event.target.id, 2)
            } else {
                alert("Total member of family exceeds")
                event.target.checked = false
            }
        }else{
            alert("Exceeds max Count")
            event.target.checked = false
        }
    }
    else{
        globalState[1][index]=0
        removeOptionsById(event.target.id)
    }

}

//triggres on click of select
let selectChanged = (event) => {
    let id = event.target.id.split('-')[0]
    let prev=globalState[1][globalState[0].indexOf(id)]
    globalState[1][globalState[0].indexOf(id)]=0
    let sum=findSum()
    if ((sum+Number(event.target.value)<=maxCount)) {
        updateStatus(id, Number(event.target.value))
    }else{
        alert("exceeds max count")
        event.target.selectedIndex=prev-1
        globalState[1][globalState[0].indexOf(id)]=prev
    }
}

let submit=()=>{
    let output=''
    globalState[0].forEach((ele,indx)=>{
        if (globalState[1][indx]) {
            output+=`${ele} : ${globalState[1][indx]}\n`
        }
    })
    alert(output)
}
window.addEventListener('load', function () {
    var status = [["couple", "parents", "infant", "kids", "adult"], []]
    var range = [1, 2, 4, 6, 25]
    globalState = status
    let inputEle = document.getElementById("range")
    let bubble = document.getElementById("bubble")
    maxCount = 4;
    updateTagline(allTags['3'])
    // createOptions("couple-num", maxCount)
    for (let i = 0; i < status[0].length; i++) {
        document.getElementById(status[0][i]).addEventListener("change", checkboxChanged)
    }
    inputEle.addEventListener("input", (event) => {
        maxCount = range[Number(event.target.value) - 1];
        globalState[1]=[]
        setBubble(inputEle, bubble);
    });
    setBubble(inputEle, bubble);
})   