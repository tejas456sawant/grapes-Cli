import React, { useState, useCallback, useMemo } from "react";
import ReactDOMServer from 'react-dom/server'; // For React 18+

import styled from "@emotion/styled";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import * as IoIcons from "react-icons/io";
import * as MdIcons from "react-icons/md";

const IconPickerWrapper = styled.div`
  width: 100%;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 8px 8px 0 0;
  font-size: 14px;
  &:focus {
    outline: none;
    background: #f8f8f8;
  }
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
    transform: scale(1.1);
  }

  &:active {
    background: #e0e0e0;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #333;
  }
`;

const NoResults = styled.div`
  padding: 10px;
  text-align: center;
  color: #666;
`;

const IconPicker = ({ onSelectIcon }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Memoize the combined icons object
  const allIcons = useMemo(() => ({
    ...FaIcons,
    ...AiIcons,
    ...BiIcons,
    ...IoIcons,
    ...MdIcons,
  }), []);

  // Memoize the filtered icons
  const filteredIcons = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return Object.entries(allIcons)
      .filter(([key]) =>
        key.toLowerCase().includes(term) &&
        typeof allIcons[key] === 'function'
      )
      .slice(0, 100);
  }, [searchTerm, allIcons]);

  const handleIconSelect = useCallback((iconName, Icon) => {
    // Create a React element
    const iconElement = React.createElement(Icon);
  
    // Convert the element to an HTML string
    const svgHTML = ReactDOMServer.renderToStaticMarkup(iconElement);
  
    onSelectIcon({
      iconName,
      Icon,
      className: `fa ${iconName.toLowerCase()}`,
      svg: svgHTML,  // SVG output
    });
  }, [onSelectIcon]);
  
  


  return (
    <IconPickerWrapper>
      <SearchInput
        type="text"
        placeholder="Search icons..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        autoFocus
      />
      <IconGrid>
        {filteredIcons.length > 0 ? (
          filteredIcons.map(([iconName, Icon]) => (
            <IconButton
              key={iconName}
              onClick={() => handleIconSelect(iconName, Icon)}
              title={iconName}
            >
              <Icon />
            </IconButton>
          ))
        ) : (
          <NoResults>No icons found</NoResults>
        )}
      </IconGrid>
    </IconPickerWrapper>
  );
};

export default IconPicker;