
$(".full_info").click(function () {
    let valClass = (this.className).split(' ')[1];
    console.log(valClass);
    sort(valClass);
});
function sort(valClass) {
    let elements = $(".sort_rows");
    console.log(elements);
    let element = bubbleSort(elements,valClass);
    //console.log(Number($(elements[2]).find(`.${valClass}`).text()));
    console.log(element);
    //$(".table_project").append(elements);
    //$(".sort_rows").remove();

}

function bubbleSort(arr,valClass) {
    for (let i = 0, endI = Object.keys(arr).length - 2; i < endI; i++) {
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
