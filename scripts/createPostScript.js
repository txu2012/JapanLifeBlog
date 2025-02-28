let contentTarget = document.getElementById("content-container");                           // Target our DIV's DOM node.

contentTarget.onpaste = (e) => {                                                      // When there's an paste event on our target DIV:
   let cbPayload = [...(e.clipboardData || e.originalEvent.clipboardData).items];     // Capture the ClipboardEvent's eventData payload as an array
       cbPayload = cbPayload.filter(i => /images/.test(i.type));                       // Strip out the non-image bits
   
   if(!cbPayload.length || cbPayload.length === 0) return false;                      // If no image was present in the collection, bail.
   
   let reader = new FileReader();                                                     // Instantiate a FileReader...
   reader.onload = (e) => contentTarget.innerHTML = `<img src="${e.target.result}">`; // ... set its onLoad to render the event target's payload
   reader.readAsDataURL(cbPayload[0].getAsFile());                                    // ... then read in the pasteboard image data as Base64
};