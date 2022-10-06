const target = document.getElementById('notion-app');

const config = { attributes: false, childList: true, subtree: true };


/**
 * A loosely function to make disapear/appear the closest container with a width.
 * 
 * @param {*} node The node that trigger the process
 * @param {*} display "none" if we want to make it disapear else "block"
 * @param {*} acc An acc to prevent blocking recursion
 */
function swapPagesVisibility(node, display, acc = 3) {
  if (acc < 0) return

  const width = node.style.width

  if(typeof width !== 'undefined' && width.endsWith("px")) node.style.display = display
  else swapPagesVisibility(node.parentNode, display, acc = acc - 1)
}

function retrievePageNodes(node) {
  const classes = ".page,.pageEmpty"

  if (node && node.querySelectorAll) return [node, ...node.querySelectorAll(classes)].filter(element => element.matches(classes));
  else if (node && node.matches) return [node].filter(element => element.matches(classes));
  else return []
}

const callback = (mutationList, _) => {
  for (const mutation of mutationList) {
    if (mutation.type === 'childList') {
      Array.from(mutation.addedNodes).some(node => {
        // Occurs when a page icon is added to the current DOM
        const pageNodes = retrievePageNodes(node)
        pageNodes.forEach(pageNode => swapPagesVisibility(pageNode.parentNode, "none"))
      })

      Array.from(mutation.removedNodes).some(node => {
        // Occurs when a page icon is removed from the current DOM
        const pageNodes = retrievePageNodes(node)
        if (pageNodes.length > 0) swapPagesVisibility(mutation.target, "block")
      })
    }
  }
};

const observer = new MutationObserver(callback);

observer.observe(target, config);

