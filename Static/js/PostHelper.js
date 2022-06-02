function like(id) {
    let el = document.getElementById(id + '-upvote');
    let elparent = document.getElementById(id + '-upvoteparent');

    fetch(`/api/v1/like?id=` + id, {
        method: 'POST'
    })
        .then(r => r.json())
        .then(r => {
            if (r.status === 'success') {
                if (r.action === 'liked') {
                    el.innerText = Number.parseInt(el.innerText)+1;
                    elparent.style = 'color: green; font-size: 20pt;';
                } else if (r.action === 'unlike-lmfao') {
                    el.innerText = Number.parseInt(el.innerText)-1;
                    elparent.style = 'color: lightgray; font-size: 20pt;';
                }
            }
        });
}