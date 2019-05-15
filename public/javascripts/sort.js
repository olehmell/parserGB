//$(".reload").on("click",()=>location.reload());
//$(document).ready(sort("amount", true, 9));
$(".sortUp").on("click",function () {
    let $this = $(this);
    let valClass = ($this.parent());
    $this.toggleClass("down");
    $(".hide").remove();
    console.log(valClass[0].className.split(' ')[2]);
    sort(valClass[0].className.split(' ')[2], $this.hasClass('down'),2);
});
function sort(valClass,down,sub) {
    let elements = $(".sort_rows");

    let elementSort;
    if(!down)
    {
        elementSort = bubbleSortUp(elements.clone(),valClass,sub);
        console.log(elementSort);
        for (let i = 0; i < Object.keys(elements).length - sub;i++)
        {
            elements[i].replaceWith(elementSort[i+1]);
        }
        console.log(elements);
    }
    else
    {
        elementSort = bubbleSortDown(elements.clone(),valClass,sub);
        console.log(elementSort);
        for (let i = 0; i < Object.keys(elements).length - sub;i++)
        {
            elements[i].replaceWith(elementSort[i]);
        }
        console.log(elements);
    }



}

function bubbleSortUp(arr,valClass,sub) {
    for (let i = 0, endI = Object.keys(arr).length - sub; i < endI; i++) {
        for (let j = 0, endJ = endI - i; j < endJ; j++) {
            if (Number($(arr[j]).find(`.${valClass}`).text()) > Number($(arr[j+1]).find(`.${valClass}`).text())) {
                const swap = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = swap;
            }
        }
    }
    return arr;
}
function bubbleSortDown(arr,valClass,sub) {
    for (let i = 0, endI = Object.keys(arr).length - sub; i < endI; i++) {
        for (let j = 0, endJ = endI - i; j < endJ; j++) {
            if (Number($(arr[j]).find(`.${valClass}`).text()) < Number($(arr[j+1]).find(`.${valClass}`).text())) {
                const swap = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = swap;
            }
        }
    }
    return arr;
}
