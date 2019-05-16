$(".sortUp").on("click",function () {
    let $this = $(this);
    let valClass = ($this.parent());
    $this.toggleClass("down");
    console.log(valClass[0].className.split(' ')[2]);
    sort(valClass[0].className.split(' ')[2], $this.hasClass('down'));
});
function sort(valClass,down) {
    let elements = $(".sort_rows");
    //$(".hide").remove();
    let elementSort;
    if(!down)
    {
        elementSort = bubbleSortUp(elements.clone(),valClass,elements);
        for (let i = 0; i < Object.keys(elements).length - 10;i++)
        {
            elements[i].replaceWith(elementSort[i+1]);
        }
    }
    else
    {
        elementSort = bubbleSortDown(elements.clone(),valClass,elements);
        for (let i = 0; i < Object.keys(elements).length - 10;i++)
        {
            elements[i].replaceWith(elementSort[i]);
        }
    }



}

function bubbleSortUp(arr,valClass) {
    for (let i = 0, endI = Object.keys(arr).length - 10; i < endI; i++) {
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
function bubbleSortDown(arr,valClass) {
    for (let i = 0, endI = Object.keys(arr).length - 10; i < endI; i++) {
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