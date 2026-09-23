const tableCustomStyles = {
  table: {
    style: {
      borderRadius: "8px",
      overflow: "hidden",
    },
  },

  headRow: {
    style: {
      backgroundColor: "#0ea5e9",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "700",
      minHeight: "50px",
    },
  },

  headCells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
      whiteSpace: "nowrap",
    },
  },

  rows: {
    style: {
      fontSize: "14px",
      minHeight: "55px",
      borderBottom: "1px solid #e2e8f0",
    },

    highlightOnHoverStyle: {
      backgroundColor: "#f0f9ff",
      cursor: "pointer",
      transitionDuration: "0.15s",
      transitionProperty: "background-color",
      borderBottomColor: "#bae6fd",
    },
  },

  cells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },

  pagination: {
    style: {
      borderTop: "1px solid #e2e8f0",
      minHeight: "56px",
      fontSize: "14px",
    },
  },

  noData: {
    style: {
      padding: "30px",
      fontSize: "14px",
      color: "#64748b",
    },
  },

  progress: {
    style: {
      minHeight: "200px",
    },
  },
};

export default tableCustomStyles;
