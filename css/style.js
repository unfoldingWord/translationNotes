var style = {
  translationHelpsContent: {
    overflowY: "scroll",
    minWidth: "100%",
    padding: '9px',
    minHeight: "390px",
    maxHeight: "390px",
    backgroundColor: "var(--border-color)"
  },
  targetVerseDisplayContent: {
    fontSize: "16px",
    overflowY: "scroll",
    minHeight: '128px',
    Width: '482px',
    marginBottom: '5px',
    padding: '9px'
  },
  checkStatusComponent: {
    buttonGroup:{
      padding: "0px",
      width: "85px"
    },
    buttons:{
      width:'100%',
      borderRadius: "0px",
      padding: "10px"
    },
    buttonPrevious: {
      marginLeft: "-1px",
      width:'100%',
      borderRadius: "0px",
      padding: "8px"
    },
    buttonNext:{
      width:'100%',
      borderRadius: "0px",
      padding: "8px"
    },
  },
  targetVerse:{
    minHeight: '120px',
    margin: '0 2.5px 5px 0'
  },
  currentWord:{
    color: "var(--reverse-color)",
    padding: "0px",
    boxSizing: "border-box",
    fontSize: "20px"
  },
  tabStyling:{
    borderRadius: "0px",
    backgroundColor: "var(--background-color-dark)",
  },
  buttonsDivPanel:{
    width: "100%",
    height: "390px",
    backgroundColor: "var(--background-color)",
    boxSizing: "border-box",
  },
  buttonGlyphicons:{
    color: "var(--reverse-color)",
    fontSize: "20px"
  },
  tHelpsOpen:{
    float: "left",
    marginTop: "50vh",
    zIndex: "999",
    color: "var(--reverse-color)",
    backgroundColor: "var(--text-color-dark)",
    padding: "10px 0px",
    marginLeft: "-15px",
    borderRadius: "5px 0px 0px 5px"
  },
  tHelpsClosed:{
    float: "right",
    marginTop: "50vh",
    zIndex: "999",
    color: "var(--reverse-color)",
    backgroundColor: "var(--text-color-dark",
    padding: "10px 0px",
    marginLeft: "-15px",
    borderRadius: "5px 0px 0px 5px"
  },
  linkActive: {
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '5px 20px',
    cursor: 'pointer'
  },
  linkInactive: {
    fontWeight: 'bold',
    color: 'var(--accent-color-dark)',
    margin: '5px 20px',
    textAlign: 'right',
    cursor: 'default'
  },
  checkInfo: {
    flex: '0 0 120px',
    display: 'flex',
    margin: '0 10px',
    color: 'var(--reverse-color)',
    backgroundColor: 'var(--accent-color-dark)',
    boxShadow: '0 3px 10px var(--background-color)',
    borderRadius: '2px',
  },
  leftSide: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSide: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: '10px',
    borderLeft: '1px solid var(--reverse-color)',
  },
  title: {
    maxHeight: '100px',
    overflowY: 'auto',
    padding: '0 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  phrase: {
    maxHeight: '80px',
    overflowY: 'auto',
    padding: '0 20px',
    textAlign: 'center',
  }
}

module.exports = style;
