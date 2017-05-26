var style = {
  handleIcon:{
    zIndex: "999",
    color: "var(--reverse-color)",
    backgroundColor: "var(--text-color-dark)",
    padding: "10px 0px",
    borderRadius: "5px 0px 0px 5px"
  },
  handleIconDiv: {
    flex: '0 0 15px',
    display: 'flex',
    alignItems: 'center',
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
};

module.exports = style;
