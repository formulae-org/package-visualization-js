/*
Fōrmulæ visualization package. Module for reduction.
Copyright (C) 2015-2026 Laurence R. Ugalde

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

"use strict";

export class Visualization extends Formulae.Package {}

// Creation defaults, which are deliberately not the defaults applied to a file that lacks the attributes
// (see Visualization.SHOW_BORDER_WHEN_ABSENT in expression.js): a rectangle you have just built should be
// visible, while a rectangle authored before the flags existed should keep looking the way it was authored.
// The edition dialog in edition.js starts from the same pair.
Visualization.RectangleOptions = class extends CanonicalOptions {
	constructor() {
		super();
		this.showBorder    = true;
		this.showBaselines = false;
	}
	
	checkOption(expression, option) {
		let name = option.children[0].get("Value").toLowerCase();
		let value = option.children[1];
		
		switch (name) {
			case "show border":
			case "show baselines": {
				let tag = value.getTag();
				if (tag !== "Logic.True" && tag !== "Logic.False") {
					ReductionManager.setInError(value, "Value is not a boolean");
					return false;
				}
				
				if (name === "show border") {
					this.showBorder = tag === "Logic.True";
				}
				else {
					this.showBaselines = tag === "Logic.True";
				}
				return true;
			}
		}
		
		ReductionManager.setInError(option.children[0], "Unknown option");
		return false;
	}
};

Visualization.createRectangle = async (createRectangle, session) => {
	// 2 and 4 children carry no options; 3 and 5 end with them. Every arity is unambiguous, so the options
	// expression is simply whatever sits past the positional arguments.
	let n = createRectangle.children.length;
	let options = new Visualization.RectangleOptions();
	options.checkOptions(createRectangle, n == 3 ? createRectangle.children[2] : (n == 5 ? createRectangle.children[4] : undefined));
	
	let width = Arithmetic.getNativeInteger(createRectangle.children[0]);
	if (width === undefined || width <= 0) {
		ReductionManager.setInError(createRectangle.children[0], "Invalid value");
		throw new ReductionError();
	}
	
	let height = Arithmetic.getNativeInteger(createRectangle.children[1]);
	if (height === undefined || height <= 0) {
		ReductionManager.setInError(createRectangle.children[1], "Invalid value");
		throw new ReductionError();
	}
	
	let horzBaseline, vertBaseline;
	
	if (n <= 3) {
		// Baselines omitted: centre them, the same default the edition dialog resolves for an empty field
		horzBaseline = Math.round(height / 2);
		vertBaseline = Math.round(width  / 2);
	}
	else {
		horzBaseline = Arithmetic.getNativeInteger(createRectangle.children[2]);
		if (horzBaseline === undefined || horzBaseline < 0 || horzBaseline > height) {
			ReductionManager.setInError(createRectangle.children[2], "Invalid value");
			throw new ReductionError();
		}
		
		vertBaseline = Arithmetic.getNativeInteger(createRectangle.children[3]);
		if (vertBaseline === undefined || vertBaseline < 0 || vertBaseline > width) {
			ReductionManager.setInError(createRectangle.children[3], "Invalid value");
			throw new ReductionError();
		}
	}
	
	let result = Formulae.createExpression("Visualization.Rectangle");
	result.set("Width",              width);
	result.set("Height",             height);
	result.set("HorizontalBaseline", horzBaseline);
	result.set("VerticalBaseline",   vertBaseline);
	result.set("ShowBorder",         options.showBorder);
	result.set("ShowBaselines",      options.showBaselines);
	
	createRectangle.replaceBy(result);
	return true;
};

Visualization.setColor = async (setColor, session) => {
	let colorExpression = setColor.children[1];
	if (colorExpression.getTag() !== "Color.Color") {
		ReductionManager.setInError(colorExpression, "Expression is not a color");
		throw new ReductionError();
	}
	
	let result = Formulae.createExpression("Visualization.Color");
	result.set("Red",   colorExpression.get("Red"));
	result.set("Green", colorExpression.get("Green"));
	result.set("Blue",  colorExpression.get("Blue"));
	result.set("Alpha", colorExpression.get("Alpha"));
	
	result.addChild(setColor.children[0]);
	
	setColor.replaceBy(result);
	return true;
};

Visualization.setBoldItalic = async (setBoldItalic, session) => {
	let value = true;
	if (setBoldItalic.children.length >= 2) {
		let valueExpression = setBoldItalic.children[1];
		let tag = valueExpression.getTag();
		if (tag === "Logic.True") {
			value = true;
		}
		else if (tag === "Logic.False") {
			value = false;
		}
		else {
			ReductionManager.setInError(valueExpression, "Expression must be boolean");
			throw new ReductionError();
		}
	}
	
	let set = true;
	if (setBoldItalic.children.length >= 3) {
		let setExpression = setBoldItalic.children[2];
		let tag = setExpression.getTag();
		if (tag === "Logic.True") {
			set = true;
		}
		else if (tag === "Logic.False") {
			set = false;
		}
		else {
			ReductionManager.setInError(setExpression, "Expression must be boolean");
			throw new ReductionError();
		}
	}
	
	let result = Formulae.createExpression(
		setBoldItalic.getTag() === "Visualization.SetBold" ?
		"Visualization.Bold" :
		"Visualization.Italic"
	);
	result.set("Value", value);
	result.set("Set",   set);
	
	result.addChild(setBoldItalic.children[0]);
	
	setBoldItalic.replaceBy(result);
	return true;
};

Visualization.setFontSizeAndIncrement = async (setFontSizeAndIncrement, session) => {
	let isSet = setFontSizeAndIncrement.getTag() === "Visualization.SetFontSize";
	
	let parameterExpression = setFontSizeAndIncrement.children[1];
	let parameter = Arithmetic.getNativeInteger(parameterExpression);
	if (parameter === undefined || (isSet && parameter <= 0)) {
		ReductionManager.setInError(parameterExpression, "Invalid value");
		throw new ReductionError();
	}
	
	let result = Formulae.createExpression(
		isSet ?
		"Visualization.FontSize" :
		"Visualization.FontSizeIncrement"
	);
	result.set(isSet ? "Size" : "Increment", parameter);
	
	result.addChild(setFontSizeAndIncrement.children[0]);
	
	setFontSizeAndIncrement.replaceBy(result);
	return true;
};

Visualization.setFontName = async (setFontName, session) => {
	let nameExpression = setFontName.children[1];
	if (nameExpression.getTag() !== "String.String") {
		ReductionManager.setInError(nameExpression, "Expression is not a string");
		throw new ReductionError();
	}
	
	let result = Formulae.createExpression(Visualization.FontName);
	result.set("Name", nameExpression.get("Value"));
	
	result.addChild(setFontName.children[0]);
	
	setFontName.replaceBy(result);
	return true;
};

Visualization.createInfix = async (createInfix, session) => {
	let operator = createInfix.children[0];
	if (operator.getTag() !== "String.String") return false;
	
	let operands = createInfix.children[1];
	if (operands.children.length < 2) return false;
	
	let result = Formulae.createExpression("Visualization.Infix");
	result.set("Operator", operator.get("Value"));
	
	for (let i = 0, n = operands.children.length; i < n; ++i) {
		result.addChild(operands.children[i].clone());
	}
	
	createInfix.replaceBy(result);
	return true;
};

Visualization.setReducers = () => {
	ReductionManager.addReducer("Visualization.CreateRectangle",      Visualization.createRectangle,         "Visualization.createRectangle");
	ReductionManager.addReducer("Visualization.SetColor",             Visualization.setColor,                "Visualization.setColor");
	ReductionManager.addReducer("Visualization.SetBold",              Visualization.setBoldItalic,           "Visualization.setBoldItalic");
	ReductionManager.addReducer("Visualization.SetItalic",            Visualization.setBoldItalic,           "Visualization.setBoldItalic");
	ReductionManager.addReducer("Visualization.SetFontSize",          Visualization.setFontSizeAndIncrement, "Visualization.setFontSizeAndIncrement");
	ReductionManager.addReducer("Visualization.SetFontSizeIncrement", Visualization.setFontSizeAndIncrement, "Visualization.setFontSizeAndIncrement");
	ReductionManager.addReducer("Visualization.SetFontName",          Visualization.setFontName,             "Visualization.setFontName");
	ReductionManager.addReducer("Visualization.CreateInfix",          Visualization.createInfix,             "Visualization.createInfix");
};
