import React from "react";

import { Option } from "@shared/types";

import OptionComponent from "@components/OptionComponent";

interface OptionsComponentProps {
    options: Option[];
    selectedOptionIds: number[];
    onClickOption: (option: Option) => void;
}

const OptionsComponent: React.FC<OptionsComponentProps> = ({
    options,
    selectedOptionIds,
    onClickOption,
}) => {
    return (
        <div className="fixed-grid has-1-cols-mobile has-1-cols-tablet has-2-cols-desktop mb-5">
            <div className="grid">
                {options.map((option) => (
                    <div key={option.id} className="cell">
                        <OptionComponent
                            option={option}
                            isSelected={selectedOptionIds.includes(option.id)}
                            onClick={onClickOption}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OptionsComponent;
