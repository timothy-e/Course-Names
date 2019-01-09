function handleText(textNode) {
    /*
    Can't add a child to a <p> so instead create a span containing
    the text and the new link.
    */
    if (textNode.nodeName !== '#text' ||
        textNode.parentNode.nodeName === 'SCRIPT' ||
        textNode.parentNode.nodeName === 'STYLE') {
            return;
        }
    let originalText = textNode.textContent;
    let newHTML = replaceCourse("CS 241", "Foundations", originalText)

    if (newHTML !== originalText) {
        let newSpan = document.createElement('span');
        newSpan.innerHTML = newHTML;
        textNode.parentNode.replaceChild(newSpan, textNode);
    }
}

function replaceCourse(courseCode, courseName, text) {
    var regexCourseCode = new RegExp(courseCode, "gi");
    return text.replace(regexCourseCode, "<a href='' title=" + courseName + " style='background-color:white;color:black;text-decoration:none'>" + courseCode + "</a>")
}


let traverser = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {acceptNode: function(node) {
        if (node.textContent.length === 0) {
            return NodeFilter.FILTER_SKIP; // skip empty text
        }
        return NodeFilter.FILTER_ACCEPT;
    }},
    false
);
let nodeList = []
while (traverser.nextNode()) {
    nodeList.push(traverser.currentNode)
}

nodeList.forEach(function(node) {
    handleText(node);
})
