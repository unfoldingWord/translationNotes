import React from 'react'

class HelpInfo extends React.Component{
  render(){
   return (
     <div style={{color: "#fff", height: "100%", overflowY: 'scroll'}}>
       <h3 style={{marginTop: "0px"}}>
         To complete this check:
       </h3>
       <ul>
           <li>Highlight (click on) the part of your translation that corresponds to the current check.</li>
           <li>If the translation has been translated well, select the check mark. If the translation could be improved, select the flag. For help in evaluating the translation, read the Note on the translationNotes tab and consult the explanation on the far right of the screen.</li>
           <li>If you selected the flag, please type a replacement for the highlighted part of the translation on the “Propose Changes” tab (under the pencil). Then please click the box next to the problem that this change addresses.</li>
           <li>To explain to other members of the translation team why your change is necessary, please write the reason for the change on the “Leave a Note” tab (under the bubble with three dots in it).</li>
           <li>When you have completed the check, click the down arrow to advance to the next check. (To return to the previous check, click the up arrow.)</li>
       </ul>
     </div>
   )
  }
}

module.exports = HelpInfo;
