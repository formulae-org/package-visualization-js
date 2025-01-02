/*
Fōrmulæ visualization package. Module for expression definition & visualization.
Copyright (C) 2015-2025 Laurence R. Ugalde

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

'use strict';

export class Visualization extends Formulae.Package {}

Visualization.CrossedOut = class extends Expression.UnaryExpression {
	getTag() { return "Visualization.CrossedOut"; }
	getName() { return Visualization.messages["nameCrossedOut"]; }
	getChildName(index) { return Visualization.messages["childCrossedOut"]; }

	prepareDisplay(context) {
		let child = this.children[0];
		child.prepareDisplay(context);
		
		child.x = child.y = 2;
		
		this.width = 2 + child.width + 2;
		this.height = 2 + child.height + 2;
		
		this.horzBaseline = 2 + child.horzBaseline;
		this.vertBaseline = 2 + child.vertBaseline;
	}
	
	display(context, x, y) {
		let child = this.children[0];
		
		child.display(context, x + child.x, y + child.y);

		context.beginPath();
		context.moveTo (x, y + this.height); context.lineTo(x + this.width, y); // preventing obfuscation
		context.stroke();
	}
}

Visualization.Metrics = class extends Expression.UnaryExpression {
	getTag() { return "Visualization.Metrics"; }
	getName() { return Visualization.messages["nameMetrics"]; }
	getChildName(index) { return Visualization.messages["childMetrics"]; }

	prepareDisplay(context) {
		let child = this.children[0];
		
		child.prepareDisplay(context);
		
		child.x = child.y = 5;
		this.width = 5 + child.width + 5;
		this.height = 5 + child.height + 5;
		this.horzBaseline = 5 + child.horzBaseline;
		this.vertBaseline = 5 + child.vertBaseline;
	}
	
	display(context, x, y) {
		let child = this.children[0];
		
		let bkpStrokeStyle = context.strokeStyle;
		context.strokeStyle = "#7f7f7f";

		context.strokeRect(x, y, this.width, this.height);

		context.beginPath();

		// vertical baselines
		context.moveTo (x + 5 + child.vertBaseline, y              ); context.lineTo(x + 5 + child.vertBaseline, y + 5              ); // preventing obfuscation
		context.moveTo (x + 5 + child.vertBaseline, y + this.height); context.lineTo(x + 5 + child.vertBaseline, y + this.height - 5); // preventing obfuscation

		// horizontal baselines
		context.moveTo (x,              y + 5 + child.horzBaseline); context.lineTo(x + 5,              y + 5 + child.horzBaseline); // preventing obfuscation
		context.moveTo (x + this.width, y + 5 + child.horzBaseline); context.lineTo(x + this.width - 5, y + 5 + child.horzBaseline); // preventing obfuscation

		context.stroke();

		context.strokeStyle = bkpStrokeStyle;
		
		child.display(context, x + child.x, y + child.y);
	}
}

Visualization.Rectangle = class extends Expression.NullaryExpression {
	getTag() { return "Visualization.Rectangle"; }
	getName() { return Visualization.messages["nameRectangle"]; }

	set(name, value) {
		switch (name) {
			case "Width":              this.width        = value; return;
			case "Height":             this.height       = value; return;
			case "HorizontalBaseline": this.horzBaseline = value; return;
			case "VerticalBaseline":   this.vertBaseline = value; return;
			default: super.set(name. value);
		}
	}
	
	get(name) {
		switch (name) {
			case "Widht":              return this.width;
			case "Height":             return this.height;
			case "HorizontalBaseline": return this.horzBaseline;
			case "VerticalBaseline":   return this.vertBaseline;
			default: return super.get(name);
		}
	}
	
	getSerializationNames() {
		return [ "Width",  "Height", "HorizontalBaseline", "VerticalBaseline"];
	}
	
	async getSerializationStrings() {
		return [ this.width.toString(), this.height.toString(), this.horzBaseline.toString(), this.vertBaseline.toString() ];
	}
	
	setSerializationStrings(strings, promises) {
		this.set("Width",              parseInt(strings[0]));
		this.set("Height",             parseInt(strings[1]));
		this.set("HorizontalBaseline", parseInt(strings[2]));
		this.set("VerticalBaseline",   parseInt(strings[3]));
	}
};

Visualization.HorizontalArray = class extends Expression {
	getTag() { return "Visualization.HorizontalArray"; }
	getName() { return "Horizontal array"; }
	canHaveChildren(count) { return count >= 2; }

	prepareDisplay(context) {
		this.width = 0;
		this.horzBaseline = 0;

		let i, n = this.children.length;
		let maxSemiHeight = 0;
		let child;

		for (i = 0; i < n; ++i) {
			(child = this.children[i]).prepareDisplay(context);

			if (child.horzBaseline > this.horzBaseline) this.horzBaseline = child.horzBaseline;
			if (child.height - child.horzBaseline > maxSemiHeight) maxSemiHeight = child.height - child.horzBaseline;

			if (i > 0) this.width += 5;
			child.x = this.width;
			this.width += child.width;
		}
		
		for (i = 0; i < n; ++i) {
			child = this.children[i];
			child.y = this.horzBaseline - child.horzBaseline;
		}

		this.height = this.horzBaseline + maxSemiHeight;
		this.vertBaseline = Math.round(this.width / 2);
	}

	display(context, x, y) {
		let child;

		for (let i = 0, n = this.children.length; i < n; ++i) {
			(child = this.children[i]).display(context, x + child.x, y + child.y);
		}
	}
};

Visualization.VerticalArray = class extends Expression {
	getTag() { return "Visualization.VerticalArray"; }
	getName() { return "Vertical array"; }
	canHaveChildren(count) { return count >= 2; }

	prepareDisplay(context) {
		this.height = 0;
		this.vertBaseline = 0;

		let i, n = this.children.length;
		let maxSemiWidth = 0;
		let child;

		for (i = 0; i < n; ++i) {
			(child = this.children[i]).prepareDisplay(context);

			if (child.vertBaseline > this.vertBaseline) this.vertBaseline = child.vertBaseline;
			if (child.width - child.vertBaseline > maxSemiWidth) maxSemiWidth = child.width - child.vertBaseline;

			if (i > 0) this.height += 5;
			child.y = this.height;
			this.height += child.height;
		}
		
		for (i = 0; i < n; ++i) {
			child = this.children[i];
			child.x = this.vertBaseline - child.vertBaseline;
		}

		this.width = this.vertBaseline + maxSemiWidth;
		this.horzBaseline = Math.round(this.height / 2);
	}

	display(context, x, y) {
		let child;

		for (let i = 0, n = this.children.length; i < n; ++i) {
			(child = this.children[i]).display(context, x + child.x, y + child.y);
		}
	}

	moveAcross(i, direction) {
		if (direction == Expression.UP) {
			if (i > 0) {
				return this.children[i - 1].moveTo(direction);
			}
		}
		else if (direction == Expression.DOWN) {
			if (i < this.children.length - 1) {
				return this.children[i + 1].moveTo(direction);
			}
		}
		
		return this.moveOut(direction);
	}

	moveTo(direction) {
		let n = this.children.length;
		
		if (n == 0) return this;
		
		if (direction == Expression.UP) {
			return this.children[n - 1].moveTo(direction);
		}
		else {
			return this.children[0].moveTo(direction);
		}
	}
};

Visualization.Color = class extends Expression.UnaryExpression {
	getTag() { return "Visualization.Color"; }
	getName() { return Visualization.messages["nameColor"]; }

	set(name, value) {
		switch (name) {
			case "Red"  : this.redValue   = value; return;
			case "Green": this.greenValue = value; return;
			case "Blue" : this.blueValue  = value; return;
			case "Alpha": this.alphaValue = value; return;
		}

		super.set(name, value);
	}
	
	get(name) {
		switch (name) {
			case "Red"  : return this.redValue;
			case "Green": return this.greenValue;
			case "Blue" : return this.blueValue;
			case "Alpha": return this.alphaValue;
		}
		
		super.get(name);
	}
	
	getSerializationNames() {
		return [ "Red", "Green", "Blue", "Alpha" ];
	}
	
	async getSerializationStrings() {
		return [ this.redValue.toString(), this.greenValue.toString(), this.blueValue.toString(), this.alphaValue.toString() ];
	}
	
	setSerializationStrings(strings, promises) {
		let f = parseFloat(strings[0]); if (isNaN(f)) throw "Invalid number: " + strings[0];
		this.set("Red", f);
		
		f = parseFloat(strings[1]); if (isNaN(f)) throw "Invalid number: " + strings[1];
		this.set("Green", f);
		
		f = parseFloat(strings[2]); if (isNaN(f)) throw "Invalid number: " + strings[2];
		this.set("Blue", f);
		
		f = parseFloat(strings[3]); if (isNaN(f)) throw "Invalid number: " + strings[3];
		this.set("Alpha", f);
	}
	
	prepareDisplay(context) {
		let child = this.children[0];
		child.prepareDisplay(context);
		child.x = child.y = 0;
		this.width = child.width;
		this.height = child.height;
		this.horzBaseline = child.horzBaseline;
		this.vertBaseline = child.vertBaseline;
	}
	
	display(context, x, y) {
		let bkpFillStyle = context.fillStyle;
		let bkpStrokeStyle = context.strokeStyle;
		
		context.fillStyle = context.strokeStyle =
			"rgba(" +
			(this.redValue * 100.0).toString() + "%," +
			(this.greenValue * 100.0).toString() + "%," +
			(this.blueValue * 100.0).toString() + "%," +
			this.alphaValue.toString() + ")"
		;

		this.children[0].display(context, x, y);

		context.strokeStyle = bkpStrokeStyle;
		context.fillStyle = bkpFillStyle;
	}
};

Visualization.Bold = class extends Expression.UnaryExpression {
	getTag() { return "Visualization.Bold"; }
	getName() { return Visualization.messages["nameBold"]; }

	set(name, value) {
		switch (name) {
			case "Value" : this.value = value; return;
			case "Set"   : this.isSet = value; return;
		}
		
		super.set(name, value);
	}
	
	get(name) {
		switch (name) {
			case "Value" : return this.value;
			case "Set"   : return this.isSet;
		}
		
		super.get(name);
	}
	
	getSerializationNames() {
		return [ "Value", "Set" ];
	}
	
	async getSerializationStrings() {
		return [ this.value ? "True" : "False", this.isSet ? "True" : "False" ];
	}
	
	setSerializationStrings(strings, promises) {
		switch (strings[0]) {
			case "True"  : this.set("Value", true);  break;
			case "False" : this.set("Value", false); break;
			default : throw "Invalid value";
		}
		
		switch (strings[1]) {
			case "True"  : this.set("Set", true);  break;
			case "False" : this.set("Set", false); break;
			default : throw "Invalid value";
		}
	}
	
	prepareDisplay(context) {
		let child = this.children[0];
		
		let bkp = context.fontInfo.bold;
		
		if (this.isSet) {
			context.fontInfo.setBold(context, this.value);
		}
		else if (this.value) {
			context.fontInfo.setBold(context, !bkp);
		}
		
		child.prepareDisplay(context);
		
		context.fontInfo.setBold(context, bkp);
		
		child.x = child.y = 0;
		this.width = child.width;
		this.height = child.height;
		this.horzBaseline = child.horzBaseline;
		this.vertBaseline = child.vertBaseline;
	}
	
	display(context, x, y) {
		let bkp = context.fontInfo.bold;

		if (this.isSet) {
			context.fontInfo.setBold(context, this.value);
		}
		else if (this.value) {
			context.fontInfo.setBold(context, !bkp);
		}

		this.children[0].display(context, x, y);

		context.fontInfo.setBold(context, bkp);
	}
};

Visualization.Italic = class extends Expression.UnaryExpression {
	getTag() { return "Visualization.Italic"; }
	getName() { return Visualization.messages["nameItalic"]; }

	set(name, value) {
		switch (name) {
			case "Value" : this.value = value; return;
			case "Set"   : this.isSet = value; return;
		}

		super.set(name, value);
	}
	
	get(name) {
		switch (name) {
			case "Value" : return this.value;
			case "Set"   : return this.isSet;
		}

		super.get(name);
	}
	
	getSerializationNames() {
		return [ "Value", "Set" ];
	}
	
	async getSerializationStrings() {
		return [ this.value ? "True" : "False", this.isSet ? "True" : "False" ];
	}
	
	setSerializationStrings(strings, promises) {
		switch (strings[0]) {
			case "True"  : this.set("Value", true);  break;
			case "False" : this.set("Value", false); break;
			default : throw "Invalid value";
		}
		
		switch (strings[1]) {
			case "True"  : this.set("Set", true);  break;
			case "False" : this.set("Set", false); break;
			default : throw "Invalid value";
		}
	}
	
	prepareDisplay(context) {
		let child = this.children[0];
		
		let bkp = context.fontInfo.italic;

		if (this.isSet) {
			context.fontInfo.setItalic(context, this.value);
		}
		else if (this.value) {
			context.fontInfo.setItalic(context, !bkp);
		}

		child.prepareDisplay(context);

		context.fontInfo.setItalic(context, bkp);

		child.x = child.y = 0;
		this.width = child.width;
		this.height = child.height;
		this.horzBaseline = child.horzBaseline;
		this.vertBaseline = child.vertBaseline;
	}
	
	display(context, x, y) {
		let bkp = context.fontInfo.italic;

		if (this.isSet) {
			context.fontInfo.setItalic(context, this.value);
		}
		else if (this.value) {
			context.fontInfo.setItalic(context, !bkp);
		}

		this.children[0].display(context, x, y);

		context.fontInfo.setItalic(context, bkp);
	}
};

Visualization.FontSize = class extends Expression.UnaryExpression {
	getTag() { return "Visualization.FontSize"; }
	getName() { return Visualization.messages["nameFontSize"]; }

	set(name, value) {
		if (name == "Size") {
			this.size = value;
		}
		else {
			super.set(name, value);
		}
	}
	
	get(name) {
		if (name == "Size") {
			return this.size;
		}
		
		super.get(name);
	}
	
	getSerializationNames() {
		return [ "Size" ];
	}
	
	async getSerializationStrings() {
		return [ this.size.toString() ];
	}
	
	setSerializationStrings(strings, promises) {
		let f = parseFloat(strings[0]); if (isNaN(f)) throw "Invalid number: " + strings[0];
		this.set("Size", f);
	}
	
	prepareDisplay(context) {
		let child = this.children[0];
		
		let bkp = context.fontInfo.size;
		context.fontInfo.setSizeAbsolute(context, this.size);

		child.prepareDisplay(context);

		context.fontInfo.setSizeAbsolute(context, bkp);

		child.x = child.y = 0;
		this.width = child.width;
		this.height = child.height;
		this.horzBaseline = child.horzBaseline;
		this.vertBaseline = child.vertBaseline;
	}
	
	display(context, x, y) {
		let bkp = context.fontInfo.size;
		context.fontInfo.setSizeAbsolute(context, this.size);

		this.children[0].display(context, x, y);

		context.fontInfo.setSizeAbsolute(context, bkp);
	}
};

Visualization.FontSizeIncrement = class extends Expression.UnaryExpression {
	getTag() { return "Visualization.FontSizeIncrement"; }
	getName() { return Visualization.messages["nameFontSizeIncrement"]; }

	set(name, value) {
		if (name == "Increment") {
			this.increment = value;
		}
		else {
			super.set(name, value);
		}
	}
	
	get(name) {
		if (name == "Increment") {
			return this.increment;
		}
		
		super.get(name);
	}
	
	getSerializationNames() {
		return [ "Increment" ];
	}
	
	async getSerializationStrings() {
		return [ this.increment.toString() ];
	}
	
	setSerializationStrings(strings, promises) {
		let f = parseFloat(strings[0]); if (isNaN(f)) throw "Invalid number: " + strings[0];
		this.set("Increment", f);
	}
	
	prepareDisplay(context) {
		let child = this.children[0];
		
		let bkp = context.fontInfo.size;
		context.fontInfo.setSizeRelative(context, this.increment);
		
		child.prepareDisplay(context);
		
		context.fontInfo.setSizeAbsolute(context, bkp);
		
		child.x = child.y = 0;
		this.width = child.width;
		this.height = child.height;
		this.horzBaseline = child.horzBaseline;
		this.vertBaseline = child.vertBaseline;
	}
	
	display(context, x, y) {
		let bkp = context.fontInfo.size;
		context.fontInfo.setSizeRelative(context, this.increment);

		this.children[0].display(context, x, y);

		context.fontInfo.setSizeAbsolute(context, bkp);
	}
};

Visualization.FontName = class extends Expression.UnaryExpression {
	getTag() { return "Visualization.FontName"; }
	getName() { return Visualization.messages["nameFontName"]; }

	set(name, value) {
		if (name == "Name") {
			this.fontName = value;
		}
		else {
			super.set(name, value);
		}
	}
	
	get(name) {
		if (name == "Name") {
			return this.fontName;
		}
		
		super.get(name);
	}
	
	getSerializationNames() {
		return [ "Name" ];
	}
	
	async getSerializationStrings() {
		return [ this.fontName ];
	}
	
	setSerializationStrings(strings, promises) {
		this.set("Name", strings[0]);
	}
	
	prepareDisplay(context) {
		let child = this.children[0];
		
		let bkp = context.fontInfo.name;
		context.fontInfo.setName(context, this.fontName);

		child.prepareDisplay(context);

		context.fontInfo.setName(context, bkp);

		child.x = child.y = 0;
		this.width = child.width;
		this.height = child.height;
		this.horzBaseline = child.horzBaseline;
		this.vertBaseline = child.vertBaseline;
	}
	
	display(context, x, y) {
		let bkp = context.fontInfo.name;
		context.fontInfo.setName(context, this.fontName);

		this.children[0].display(context, x, y);

		context.fontInfo.setName(context, bkp);
	}
};

Visualization.Selected = class extends Expression.UnaryExpression {
	getTag() { return "Visualization.Selected"; }
	getName() { return Visualization.messages["nameSelected"]; }
	getChildName(index) { return Visualization.messages["childSelected"]; }
	
	prepareDisplay(context) {
		let child = this.children[0];
		child.prepareDisplay(context);
		
		child.x = child.y = 0;
		
		this.width = child.width;
		this.height = child.height;
		
		this.horzBaseline = child.horzBaseline;
		this.vertBaseline = child.vertBaseline;
	}
	
	display(context, x, y) {
		let child = this.children[0];
		
		///////////////////////////////////////
		
		//let bkpOperation = context.globalCompositeOperation;
		//context.globalCompositeOperation = "difference";
		
		let bkpFillStyle = context.fillStyle;
		context.fillStyle = "lightgray";
		context.fillRect(x, y, child.width, child.height);
		context.fillStyle = bkpFillStyle;
		
		//context.globalCompositeOperation = bkpOperation;
		
		child.display(context, x + child.x, y + child.y);
	}
}

Visualization.Parentheses = class extends Expression.UnaryExpression {
	getTag() { return "Visualization.Parentheses"; }
	getName() { return Visualization.messages["nameParentheses"]; }
	getChildName(index) { return Visualization.messages["childParentheses"]; }
	
	prepareDisplay(context) {
		let child = this.children[0];
		child.prepareDisplay(context);
		
		child.x = 4;
		child.y = 0;
		
		this.width = child.width + 8;
		this.height = child.height;
		
		this.horzBaseline = child.horzBaseline;
		this.vertBaseline = child.vertBaseline + 4;
	}
	
	display(context, x, y) {
		let child = this.children[0];
		
		child.display(context, x + child.x, y + child.y);
		child.drawParenthesesAround(context, x + child.x, y + child.y);
	}
}

Visualization.Spurious = class extends Expression.UnaryExpression {
	getTag() { return "Visualization.Spurious"; }
	getName() { return Visualization.messages["nameSpurious"]; }
	getChildName(index) { return Visualization.messages["childSpurious"]; }
	
	prepareDisplay(context) {
		let child = this.children[0];
		child.prepareDisplay(context);
		
		child.x = 0;
		child.y = 0;
		
		this.width = child.width;
		this.height = child.height;
		
		this.horzBaseline = child.horzBaseline;
		this.vertBaseline = child.vertBaseline;
	}
	
	display(context, x, y) {
		let child = this.children[0];
		child.display(context, x + child.x, y + child.y);
	}
}

Visualization.Key = class extends Expression.UnaryExpression {
	getTag() { return "Visualization.Key"; }
	getName() { return Visualization.messages["nameKey"]; }
	
	prepareDisplay(context) {
		let child = this.children[0];
		
		let bkpFontName = context.fontInfo.name;
		context.fontInfo.setName(context, "Arial");
		
		let bkpFontSize = context.fontInfo.size;
		context.fontInfo.setSizeRelative(context, -2);
		
		child.prepareDisplay(context);
		
		context.fontInfo.setSizeAbsolute(context, bkpFontSize);
		context.fontInfo.setName(context, bkpFontName);
		
		child.x = child.y = 5;
		this.width = child.width + 10;
		this.height = child.height + 10;
		this.horzBaseline = Math.round(this.height / 2);
		this.vertBaseline = Math.round(child.width / 2);
	}
	
	display(context, x, y) {
		let child = this.children[0];
		
		let bkpFontName = context.fontInfo.name;
		context.fontInfo.setName(context, "Arial");
		
		let bkpFontSize = context.fontInfo.size;
		context.fontInfo.setSizeRelative(context, -2);
		
		child.display(context, x + child.x, y + child.y);
		
		context.beginPath();
		context.roundRect(x + 0.5, y + 0.5, this.width,     this.height,     2);
		context.roundRect(x + 0.5, y + 0.5, this.width - 1, this.height - 1, 2);
		context.roundRect(x + 0.5, y + 0.5, this.width - 2, this.height - 2, 2);
		context.stroke();
		
		context.fontInfo.setSizeAbsolute(context, bkpFontSize);
		context.fontInfo.setName(context, bkpFontName);
	}
};

Visualization.setExpressions = function(module) {
	Formulae.setExpression(module, "Visualization.CrossedOut",      Visualization.CrossedOut);
	Formulae.setExpression(module, "Visualization.Metrics",         Visualization.Metrics);
	Formulae.setExpression(module, "Visualization.Rectangle",       Visualization.Rectangle);
	Formulae.setExpression(module, "Visualization.HorizontalArray", Visualization.HorizontalArray);
	Formulae.setExpression(module, "Visualization.VerticalArray",   Visualization.VerticalArray);
	
	Formulae.setExpression(module, "Visualization.Color",             Visualization.Color);
	Formulae.setExpression(module, "Visualization.Bold",              Visualization.Bold);
	Formulae.setExpression(module, "Visualization.Italic",            Visualization.Italic);
	Formulae.setExpression(module, "Visualization.Selected",          Visualization.Selected);
	Formulae.setExpression(module, "Visualization.Parentheses",       Visualization.Parentheses);
	Formulae.setExpression(module, "Visualization.Spurious",          Visualization.Spurious);
	Formulae.setExpression(module, "Visualization.Key",               Visualization.Key);
	
	Formulae.setExpression(module, "Visualization.FontSize",          Visualization.FontSize);
	Formulae.setExpression(module, "Visualization.FontSizeIncrement", Visualization.FontSizeIncrement);
	Formulae.setExpression(module, "Visualization.FontName",          Visualization.FontName);
	
	// functions
	[
		[ "CreateRectangle",      4, 5 ],
		[ "SetColor",             2, 2 ],
		[ "SetBold",              1, 3 ],
		[ "SetItalic",            1, 3 ],
		[ "SetFontSize",          2, 2 ],
		[ "SetFontSizeIncrement", 2, 2 ],
		[ "SetFontName",          2, 2 ]
	].forEach(row => Formulae.setExpression(module, "Visualization." + row[0], {
		clazz:        Expression.Function,
		getTag:       () => "Visualization." + row[0],
		getMnemonic:  () => Visualization.messages["mnemonic" + row[0]],
		getName:      () => Visualization.messages["name" + row[0]],
		getChildName: index => Visualization.messages["children" + row[0]][index],
		min:          row[1],
		max:          row[2]
	}));
};
