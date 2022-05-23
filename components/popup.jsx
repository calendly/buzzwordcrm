import React from 'react';

export default (props) => {
  return (
    <td className="popup-box">
      <div className="box">
        <div className="x-icon" onClick={props.handleClose}>
          x
        </div>
        {props.content}
      </div>
    </td>
  );
};
