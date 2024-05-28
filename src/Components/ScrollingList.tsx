import React, { useState, useRef, useEffect } from "react";
import { ImageTags } from "../Constants/ImageTags";
import "./ScrollingList.scss";

type Tag = {
    name: string;
    key: number;
  };

type SmoothScrollListProps = {
    tags?: Tag[];
};

const SmoothScrollList: React.FC<SmoothScrollListProps> = ({tags = ImageTags}) => {
  const [selectedTag, setSelectedTag] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedTagRef = useRef<HTMLDivElement>(null);

  const handleSelect = (key: number) => {
    if (selectedTag === key) {
      setSelectedTag(0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.overflowY = "scroll";
      }
    } else {
      setSelectedTag(key);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.overflowY = "hidden";
      }
    }
  };

  useEffect(() => {
    if (selectedTagRef.current) {
      selectedTagRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedTag]);

  return (
    <div className="scroll-wrapper">
      <div className="scroll-container" ref={scrollContainerRef}>
        {tags.map((tag) => (
          <div
            className="scroll-item"
            key={tag.key}
            data-key={tag.key}
            onClick={() => handleSelect(tag.key)}
            style={{
              color: selectedTag === tag.key ? 'orange' : 'grey',
            }}
            ref={selectedTag === tag.key ? selectedTagRef : null}
          >
            {tag.name}
          </div>
        ))}
      </div>
      <input className="center-input" placeholder='Type here...' style={{ visibility: selectedTag === 0 ? 'hidden' : 'visible' }} />
      {selectedTag !== 0 && (
        <div className="message">
          Click the label to choose again
        </div>
      )}
    </div>
  );
};

export default SmoothScrollList;
