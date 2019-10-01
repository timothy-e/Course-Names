function handleText(textNode, courses) {
  /*
    Can't add a child to a <p> so instead create a span containing
    the text and the new link.
    */
  if (
    textNode.nodeName !== "#text" ||
    textNode.parentNode.nodeName === "SCRIPT" ||
    textNode.parentNode.nodeName === "STYLE"
  ) {
    return;
  }
  let originalText = textNode.textContent;
  let newHTML = originalText;

  courses.forEach(coursePair => {
    newHTML = replaceCourse(coursePair.code, coursePair.name, newHTML);
  });

  if (newHTML !== originalText) {
    let newSpan = document.createElement("span");
    newSpan.innerHTML = newHTML;
    textNode.parentNode.replaceChild(newSpan, textNode);
  }
}

function replaceCourse(courseCode, courseName, text) {
  let regexCourseCode = new RegExp(courseCode, "gi");
  return text.replace(
    regexCourseCode,
    `<a href='' title='${courseName}' style='background-color:white;color:black;text-decoration:none'> ${courseCode} </a>`
  );
}

function linkCourses(subject, nodeList, insertCourses) {
  let courses = [];
  let xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `https://www.ucalendar.uwaterloo.ca/1819/COURSE/course-${subject}.html`,
    true
  );
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      let coursePage = $("<div></div>");
      coursePage.html(xhr.responseText);
      codePattern = RegExp(subject + "\\s*\\d\\d\\d[A-Z]?", "gi"); // SUBJ [arbitrary spacing] [3 digits] [char modifier]
      let tables = $("table", coursePage);
      for (i = 4, l = tables.length; i < l; i++) {
        codePattern.lastIndex = 0; // reset regex position

        courseInfo = $("table", coursePage)[i].rows;

        if (courseInfo.length === 0) {
          break;
        }

        let code = codePattern.exec(courseInfo[0].textContent)[0];
        let name = courseInfo[1].textContent;
        courses.push({ code, name });
      }
      insertCourses(nodeList, courses);
    }
  };
  xhr.send();
}

let traverser = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_TEXT,
  {
    acceptNode: node => {
      if (node.textContent.length === 0) {
        return NodeFilter.FILTER_SKIP; // skip empty text
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  },
  false
);

let nodeList = [];
while (traverser.nextNode()) {
  nodeList.push(traverser.currentNode);
}

function traverseNodes(nodeList, courseList) {
  nodeList.forEach(node => {
    handleText(node, courseList);
  });
}

let coursesCS = linkCourses("CS", nodeList, traverseNodes);
