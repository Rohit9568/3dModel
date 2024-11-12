import React, { useState, useEffect } from 'react';


interface DropdownProps{
    options:string[]
    onSelect:(option:any)=>void
}
const Dropdown = (props:DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option:any) => {
    setSelectedOption(option);
    setIsOpen(false);
    props.onSelect(option);
  };

  const handleKeyDown = (e:any) => {
    if (e.key === 'Enter' && isOpen) {
      selectOption(props.options[highlightedIndex]);
    } else if (e.key === 'ArrowUp' && highlightedIndex > 0) {
      setHighlightedIndex(highlightedIndex - 1);
    } else if (e.key === 'ArrowDown' && highlightedIndex < props.options.length - 1) {
      setHighlightedIndex(highlightedIndex + 1);
    }
  };

  useEffect(() => {
    // Ensure that the highlighted option is in view
    if (isOpen) {
      const list = document.getElementById('dropdown-list');
      const highlightedOption = document.getElementById(`option-${highlightedIndex}`);
      if(list && highlightedOption)
      list.scrollTop = highlightedOption.offsetTop - list.offsetTop;
    }
  }, [highlightedIndex, isOpen]);

  const dropdownStyle = {
    position: 'relative',
    width: '200px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    background: '#fff',
    cursor: 'pointer',
    textAlign: 'left',
  };

  const listStyle = {
    position: 'absolute',
    top: '100%',
    left: '0',
    width: '100%',
    maxHeight: '200px',
    overflowY: 'auto',
    border: '1px solid #ccc',
    background: '#fff',
    display: isOpen ? 'block' : 'none',
  };

  const listItemStyle = {
    listStyle: 'none',
    padding: '10px',
    cursor: 'pointer',
  };

  const highlightedStyle = {
    background: '#f0f0f0',
  };

  return (
    <div style={{
        position: 'relative',
    width: '200px',
    }}>
      <button onClick={toggleDropdown} style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ccc',
          background: '#fff',
          cursor: 'pointer',
          textAlign: 'left',
      }}>
        {selectedOption || 'Select an option'}
      </button>
      {isOpen && (
        <ul
          id="dropdown-list"
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            background: '#fff',
            display: isOpen ? 'block' : 'none',
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {props.options.map((option, index) => (
            <li
              key={index}
              id={`option-${index}`}
              onClick={() => selectOption(option)}
              style={{
                ...listItemStyle,
                ...(highlightedIndex === index ? highlightedStyle : {}),
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
