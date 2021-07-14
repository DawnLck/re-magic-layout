<div
  className="box"
  style={{
    height: '500px',
    width: '500px',
    position: 'relative',
    overflow: 'auto',
    padding: '0',
  }}
>
  <div style={{ height: '1000px', width: '1000px', padding: '10px' }}>
    <Draggable bounds="parent" {...dragHandlers}>
      <div className="box">
        I can only be moved within my offsetParent.
        <br />
        <br />
        Both parent padding and child margin work properly.
      </div>
    </Draggable>
    <Draggable bounds="parent" {...dragHandlers}>
      <div className="box">
        I also can only be moved within my offsetParent.
        <br />
        <br />
        Both parent padding and child margin work properly.
      </div>
    </Draggable>
  </div>
</div>;
