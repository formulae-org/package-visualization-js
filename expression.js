/*
Fōrmulæ visualization package. Module for expression definition & visualization.
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

Visualization.Invisible = class extends Expression.UnaryExpression {
	getTag() { return "Visualization.Invisible"; }
	getName() { return Visualization.messages["nameInvisible"]; }
	getChildName(index) { return Visualization.messages["childinvisible"]; }
	
	prepareDisplay(context) {
		let child = this.children[0];
		
		child.prepareDisplay(context);
		
		child.x = child.y = 0;
		this.width = child.width;
		this.height = child.height;
		this.horzBaseline = child.horzBaseline;
		this.vertBaseline = child.vertBaseline;
	}
	
	display(context, x, y) {}
}

// Two mirrored families of wrappers, each preserving its subexpression's dimensions and
// redeclaring one of its two baselines. They are invisible everywhere except in contexts
// that align on the baseline they redeclare.
//
// The vertical family acts on matrix/table COLUMNS (Expression.prepareDisplayAsMatrix) and
// on Visualization.VerticalArray: wrapping every element of a column makes it flush left,
// centered or flush right.
//
// The horizontal family acts on matrix/table ROWS and on Visualization.HorizontalArray:
// wrapping every element of a row makes it top-, middle- or bottom-aligned.

const verticalBaselineAt = (suffix, baseline) => class extends Expression.UnaryExpression {
	getTag() { return "Visualization.VerticalBaselineAt" + suffix; }
	getName() { return Visualization.messages["nameVerticalBaselineAt" + suffix]; }
	getChildName(index) { return Visualization.messages["childVerticalBaselineAt" + suffix]; }

	prepareDisplay(context) {
		let child = this.children[0];

		child.prepareDisplay(context);

		child.x = child.y = 0;
		this.width = child.width;
		this.height = child.height;
		this.horzBaseline = child.horzBaseline;
		this.vertBaseline = baseline(this.width);
	}

	display(context, x, y) {
		this.children[0].display(context, x, y);
	}
};

Visualization.VerticalBaselineAtLeft   = verticalBaselineAt("Left",   width => 0);
Visualization.VerticalBaselineAtCenter = verticalBaselineAt("Center", width => Math.round(width / 2));
Visualization.VerticalBaselineAtRight  = verticalBaselineAt("Right",  width => width);

const horizontalBaselineAt = (suffix, baseline) => class extends Expression.UnaryExpression {
	getTag() { return "Visualization.HorizontalBaselineAt" + suffix; }
	getName() { return Visualization.messages["nameHorizontalBaselineAt" + suffix]; }
	getChildName(index) { return Visualization.messages["childHorizontalBaselineAt" + suffix]; }

	prepareDisplay(context) {
		let child = this.children[0];

		child.prepareDisplay(context);

		child.x = child.y = 0;
		this.width = child.width;
		this.height = child.height;
		this.vertBaseline = child.vertBaseline;
		this.horzBaseline = baseline(this.height);
	}

	display(context, x, y) {
		this.children[0].display(context, x, y);
	}
};

Visualization.HorizontalBaselineAtTop    = horizontalBaselineAt("Top",    height => 0);
Visualization.HorizontalBaselineAtMiddle = horizontalBaselineAt("Middle", height => Math.round(height / 2));
Visualization.HorizontalBaselineAtBottom = horizontalBaselineAt("Bottom", height => height);

// Four shapes, on four distinct and contiguous arities:
//     CreateRectangle(w, h)                      CreateRectangle(w, h, options)
//     CreateRectangle(w, h, hbl, vbl)            CreateRectangle(w, h, hbl, vbl, options)
// Because 2..5 is contiguous, min/max express it exactly and no canHaveChildren override is needed — and a
// user can grow one form into the next a child at a time, which "2 or 4" made impossible. A full class
// rather than a spec object, because getChildName now depends on the arity: a spec object's properties are
// copied onto the instance, so an arrow function there would capture module scope and lose `this`.
Visualization.CreateRectangle = class extends Expression.Function {
	constructor() {
		super();
		this.min = 2;
		this.max = 5;
	}
	
	getTag()      { return "Visualization.CreateRectangle"; }
	getMnemonic() { return Visualization.messages["mnemonicCreateRectangle"]; }
	getName()     { return Visualization.messages["nameCreateRectangle"]; }
	
	// Index 2 is the horizontal baseline in the four- and five-child forms but the options in the
	// three-child one; same shape as Math.Arithmetic.Summation, which switches on this.children.length.
	getChildName(index) {
		let names = Visualization.messages["childrenCreateRectangle"];
		switch (index) {
			case 0:
			case 1: return names[index];
			case 2: return this.children.length == 3 ? names[4] : names[2];
			case 3: return names[3];
			case 4: return names[4];
		}
	}
};

// What a MISSING flag attribute means, which is not the same question as what an unspecified flag means at
// creation time. A file written before these two attributes existed reloads looking exactly as it was
// authored — a rectangle used as an invisible strut stays invisible — so both default to false here.
// A rectangle being *created* instead starts with its border on, so that what you just made is visible;
// those creation defaults live in the edition dialog (edition.js) and in RectangleOptions (reduction.js),
// which are separate modules exporting their own Visualization class and so cannot share these constants.
Visualization.SHOW_BORDER_WHEN_ABSENT    = false;
Visualization.SHOW_BASELINES_WHEN_ABSENT = false;

Visualization.Rectangle = class extends Expression.NullaryExpression {
	constructor() {
		super();
		// So that a rectangle built programmatically, without the flags ever being set, behaves like one
		// read from a file that does not carry them, instead of leaving showBorder undefined
		this.showBorder    = Visualization.SHOW_BORDER_WHEN_ABSENT;
		this.showBaselines = Visualization.SHOW_BASELINES_WHEN_ABSENT;
	}
	
	getTag() { return "Visualization.Rectangle"; }
	getName() { return Visualization.messages["nameRectangle"]; }
	
	set(name, value) {
		switch (name) {
			case "Width":              this.width        = value; return;
			case "Height":             this.height       = value; return;
			case "HorizontalBaseline": this.horzBaseline = value; return;
			case "VerticalBaseline":   this.vertBaseline = value; return;
			case "ShowBorder":         this.showBorder    = value; return;
			case "ShowBaselines":      this.showBaselines = value; return;
			default: super.set(name, value);
		}
	}
	
	get(name) {
		switch (name) {
			case "Width":              return this.width;
			case "Height":             return this.height;
			case "HorizontalBaseline": return this.horzBaseline;
			case "VerticalBaseline":   return this.vertBaseline;
			case "ShowBorder":         return this.showBorder;
			case "ShowBaselines":      return this.showBaselines;
			default: return super.get(name);
		}
	}
	
	// The list must stay constant. Formulae.xmlElementToExpression (formulae/formulae.js) calls
	// getSerializationNames() on a freshly created, still-empty expression and zips the result against
	// getAttribute(name), so on the read path the list cannot depend on instance state — returning only
	// [ "Width", "Height" ] for a centred rectangle would write a file that reloads with its baselines
	// silently dropped, because getXMLElement calls the same method on the populated instance and would
	// look correct. Shortening the list is never the way to make an attribute optional.
	//
	// The six therefore split by how a MISSING value is treated, not by whether they are listed:
	//   - the four metrics are mandatory. A file without one is corrupt, and setSerializationStrings throws.
	//     Centred baselines are resolved long before they are stored — by the edition dialog on Ok
	//     (edition.js) or by the baseline-less CreateRectangle forms (reduction.js) — so "centred" never
	//     reaches the file as an absence.
	//   - the two flags are optional, with null as their sentinel, because they were added after the
	//     expression shipped: a file that predates them is not corrupt, it is old, and it gets the
	//     SHOW_*_WHEN_ABSENT defaults above.
	// Do not harmonize the two halves; they answer different questions.
	getSerializationNames() {
		return [ "Width",  "Height", "HorizontalBaseline", "VerticalBaseline", "ShowBorder", "ShowBaselines" ];
	}
	
	// All six are always written, so a file saved once carries the flags explicitly from then on and stops
	// depending on the defaults above. "True"/"False" follows Calculus.Integral.DefiniteIntegralOverDomain,
	// the existing boolean-attribute precedent.
	async getSerializationStrings() {
		return [
			this.width.toString(), this.height.toString(), this.horzBaseline.toString(), this.vertBaseline.toString(),
			this.showBorder ? "True" : "False", this.showBaselines ? "True" : "False"
		];
	}
	
	// Enforces on the read path the same invariants the edition dialog and the CreateRectangle reducer
	// enforce, so a hand-edited or truncated file cannot load a rectangle whose metrics are NaN — which would
	// be invisible, since the expression draws nothing, yet would poison the layout of every ancestor.
	// Throwing is deliberate: Formulae.xmlElementToExpression catches it and, in permissive mode, replaces
	// the expression with a visible Error box carrying the message below (and rethrows when permisive=false).
	setSerializationStrings(strings, promises) {
		// A missing attribute arrives as null rather than as an absent entry, because the reader zips
		// getSerializationNames() against getAttribute(), which returns null for whatever the file omits.
		// Neither null nor "" may reach Number(): both convert to 0, which is a perfectly valid baseline,
		// so a dropped attribute would masquerade as a deliberate zero.
		let integer = (string, name) => {
			if (string === null || string.trim() === "") throw "Rectangle: missing attribute " + name;
			let value = Number(string);  // not parseInt, which silently truncates "3.7" to 3
			if (!Number.isInteger(value)) throw "Rectangle: " + name + " is not an integer: " + string;
			return value;
		};
		
		let width = integer(strings[0], "Width");
		if (width <= 0) throw "Rectangle: Width must be positive: " + width;
		
		let height = integer(strings[1], "Height");
		if (height <= 0) throw "Rectangle: Height must be positive: " + height;
		
		// The horizontal baseline is a y offset, so it is bounded by the height; the vertical one is an x
		// offset, bounded by the width
		let horzBaseline = integer(strings[2], "HorizontalBaseline");
		if (horzBaseline < 0 || horzBaseline > height) throw "Rectangle: HorizontalBaseline must be between 0 and the height (" + height + "): " + horzBaseline;
		
		let vertBaseline = integer(strings[3], "VerticalBaseline");
		if (vertBaseline < 0 || vertBaseline > width) throw "Rectangle: VerticalBaseline must be between 0 and the width (" + width + "): " + vertBaseline;
		
		// The two flags are the one part of this expression where an absent attribute is legitimate rather
		// than corrupt: it means the file predates them. Only absence falls back to the default, though —
		// DefiniteIntegralOverDomain reads its flag as `=== "True"`, which quietly turns every misspelling
		// into false, and a misspelling here is a defect worth seeing.
		let flag = (string, name, whenAbsent) => {
			if (string === null || string.trim() === "") return whenAbsent;
			if (string === "True")  return true;
			if (string === "False") return false;
			throw "Rectangle: " + name + " must be True or False: " + string;
		};
		
		let showBorder    = flag(strings[4], "ShowBorder",    Visualization.SHOW_BORDER_WHEN_ABSENT);
		let showBaselines = flag(strings[5], "ShowBaselines", Visualization.SHOW_BASELINES_WHEN_ABSENT);
		
		// Set only once everything has been validated, so a rejected rectangle is never left half-populated
		this.set("Width",              width);
		this.set("Height",             height);
		this.set("HorizontalBaseline", horzBaseline);
		this.set("VerticalBaseline",   vertBaseline);
		this.set("ShowBorder",         showBorder);
		this.set("ShowBaselines",      showBaselines);
	}
	
	// prepareDisplay stays the inherited no-op: the metrics are attributes, not something to measure.
	display(context, x, y) {
		if (!this.showBorder && !this.showBaselines) return;
		
		let bkpStrokeStyle = context.strokeStyle;
		let bkpLineWidth   = context.lineWidth;
		context.lineWidth = 1;
		
		if (this.showBorder) {
			context.strokeStyle = "#000000";
			context.strokeRect(x + 0.5, y + 0.5, this.width - 1, this.height - 1);
		}
		
		if (this.showBaselines) {
			// The same grey as Visualization.Metrics, so both read as the same kind of layout annotation.
			// Metrics has 5 px of padding and can draw its baselines as stubs in that margin; a rectangle has
			// none, so they span it instead, crossing at (VerticalBaseline, HorizontalBaseline).
			context.strokeStyle = "#7f7f7f";
			
			// Same half-pixel offset as the border, for the same reason. A baseline may sit at exactly the
			// height or the width, though, and the last paintable row is height - 1: without the clamp such a
			// baseline would be stroked outside the rectangle's own bounds. Clamped, a baseline of 0 lands on
			// the top (or left) row and one of Height on the bottom row, coinciding with the border — which
			// is geometrically what those two values mean.
			let hb = Math.min(this.horzBaseline, this.height - 1) + 0.5;
			let vb = Math.min(this.vertBaseline, this.width  - 1) + 0.5;
			
			context.beginPath();
			context.moveTo(x,      y + hb); context.lineTo(x + this.width, y + hb            ); // preventing obfuscation
			context.moveTo(x + vb, y     ); context.lineTo(x + vb,         y + this.height   ); // preventing obfuscation
			context.stroke();
		}
		
		context.strokeStyle = bkpStrokeStyle;
		context.lineWidth   = bkpLineWidth;
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
			default      : throw "Invalid value";
		}
		
		switch (strings[1]) {
			case "True"  : this.set("Set", true);  break;
			case "False" : this.set("Set", false); break;
			default      : throw "Invalid value";
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

Visualization.Code = class extends Expression.UnaryExpression {
	getTag() { return "Visualization.Code"; }
	getName() { return Visualization.messages["nameCode"]; }
	
	prepareDisplay(context) {
		let child = this.children[0];
		
		let bkpSize = context.fontInfo.size;
		context.fontInfo.setSizeRelative(context, -2);
		
		let bkpFont = context.fontInfo.name;
		context.fontInfo.setName(context, "Courier New");
		
		let bkpBold = context.fontInfo.bold;
		context.fontInfo.setBold(context, true);
		
		child.prepareDisplay(context);
		
		context.fontInfo.setBold(context, bkpBold);
		context.fontInfo.setName(context, bkpFont);
		context.fontInfo.setSizeAbsolute(context, bkpSize);
		
		child.x = child.y = 0;
		this.width = child.width;
		this.height = child.height;
		this.horzBaseline = child.horzBaseline;
		this.vertBaseline = child.vertBaseline;
	}
	
	display(context, x, y) {
		let bkpSize = context.fontInfo.size;
		context.fontInfo.setSizeRelative(context, -2);
		
		let bkpFont = context.fontInfo.name;
		context.fontInfo.setName(context, "Courier New");
		
		let bkpBold = context.fontInfo.bold;
		context.fontInfo.setBold(context, true);
		
		let bkpFillStyle = context.fillStyle;
		context.fillStyle = "rgb(235, 235, 235)";
		context.fillRect(x, y, this.width, this.height);
		context.fillStyle = bkpFillStyle;
		
		this.children[0].display(context, x, y);
		
		context.fontInfo.setBold(context, bkpBold);
		context.fontInfo.setName(context, bkpFont);
		context.fontInfo.setSizeAbsolute(context, bkpSize);
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

Visualization.CodeBlock = class extends Expression.NullaryExpression {
	getTag() { return "Visualization.CodeBlock"; }
	getName() { return Visualization.messages["nameCodeBlock"]; }
	
	set(name, value) {
		if (name == "Value") {
			this.code = value;
		}
		else {
			super.set(name, value);
		}
	}
	
	get(name) {
		if (name == "Value") {
			return this.code;
		}
		
		super.get(name);
	}
	
	getSerializationNames() {
		return [ "Value" ];
	}
	
	async getSerializationStrings() {
		return [ this.code ];
	}
	
	setSerializationStrings(strings, promises) {
		this.set("Value", strings[0]);
	}
	
	prepareDisplay(context) {
		//if (this.lines === undefined) {
			this.lines = this.code.replaceAll(/\t/g, "   ").split(/\n\r?/);
		//}
		
		let bkpFontName = context.fontInfo.name;
		let bkpFontSize = context.fontInfo.size;
		context.fontInfo.setName(context, "Courier New");
		context.fontInfo.setSizeRelative(context, -2);
		
		this.width = 0;
		this.height = 0;
		let w;
		
		for (let i = 0, n = this.lines.length; i < n; ++i) {
			w = Math.round(context.measureText(this.lines[i]).width);
			if (w > this.width) this.width = w;
			
			if (i > 0) this.height += Math.round(context.fontInfo.size * 0.25);
			this.height += context.fontInfo.size;
		}
		
		this.width += context.fontInfo.size * 2;
		this.height += context.fontInfo.size * 2;
		
		this.horzBaseline = Math.round(this.height / 2);
		this.vertBaseline = Math.round(this.width / 2);	
		
		context.fontInfo.setSizeAbsolute(context, bkpFontSize);
		context.fontInfo.setName(context, bkpFontName);
	}
	
	display(context, x, y) {
		let bkpFontName = context.fontInfo.name;
		let bkpFontSize = context.fontInfo.size;
		context.fontInfo.setName(context, "Courier New");
		context.fontInfo.setSizeRelative(context, -2);
		
		let bkpFillStyle = context.fillStyle;
		context.fillStyle = "rgb(235, 235, 235)";
		context.fillRect(x, y, this.width, this.height);
		context.fillStyle = bkpFillStyle;
		
		let yy = context.fontInfo.size * 2;
		
		for (let i = 0, n = this.lines.length; i < n; ++i) {
			this.drawText(context, this.lines[i], x + context.fontInfo.size, y + yy);
			yy += Math.round(context.fontInfo.size * 1.25);
		}
		
		context.fillStyle = bkpFillStyle;
		context.fontInfo.setSizeAbsolute(context, bkpFontSize);
		context.fontInfo.setName(context, bkpFontName);
	}
}

Visualization.Infix = class extends Expression.Infix {
	constructor() {
		super();
	}
	
	getTag() { return "Visualization.Infix"; }
	
	getName() { return Visualization.messages["nameInfix"]; }
	
	set(name, value) {
		if (name === "Operator") {
			this.operator = value;
			return;
		}
		
		super.set(name, value);
	}
	
	get(name) {
		if (name === "Operator") {
			return this.operator;
		}
		
		return super.get(name);
	}
	
	getSerializationNames() {
		return [ "Operator" ];
	}
	
	async getSerializationStrings() {
		return [ this.operator ];
	}
	
	setSerializationStrings(strings, promises) {
		this.set("Operator", strings[0]);
	}
	
	getOperator() {
		return this.operator;
	}
};

Visualization.setExpressions = function(module) {
	Formulae.setExpression(module, "Visualization.CrossedOut",      Visualization.CrossedOut);
	Formulae.setExpression(module, "Visualization.Metrics",         Visualization.Metrics);
	Formulae.setExpression(module, "Visualization.Invisible",       Visualization.Invisible);
	Formulae.setExpression(module, "Visualization.Rectangle",       Visualization.Rectangle);
	Formulae.setExpression(module, "Visualization.HorizontalArray", Visualization.HorizontalArray);
	Formulae.setExpression(module, "Visualization.VerticalArray",   Visualization.VerticalArray);

	Formulae.setExpression(module, "Visualization.VerticalBaselineAtLeft",   Visualization.VerticalBaselineAtLeft);
	Formulae.setExpression(module, "Visualization.VerticalBaselineAtCenter", Visualization.VerticalBaselineAtCenter);
	Formulae.setExpression(module, "Visualization.VerticalBaselineAtRight",  Visualization.VerticalBaselineAtRight);

	Formulae.setExpression(module, "Visualization.HorizontalBaselineAtTop",    Visualization.HorizontalBaselineAtTop);
	Formulae.setExpression(module, "Visualization.HorizontalBaselineAtMiddle", Visualization.HorizontalBaselineAtMiddle);
	Formulae.setExpression(module, "Visualization.HorizontalBaselineAtBottom", Visualization.HorizontalBaselineAtBottom);

	Formulae.setExpression(module, "Visualization.Color",       Visualization.Color);
	Formulae.setExpression(module, "Visualization.Bold",        Visualization.Bold);
	Formulae.setExpression(module, "Visualization.Italic",      Visualization.Italic);
	Formulae.setExpression(module, "Visualization.Code",        Visualization.Code);
	Formulae.setExpression(module, "Visualization.Selected",    Visualization.Selected);
	Formulae.setExpression(module, "Visualization.Parentheses", Visualization.Parentheses);
	Formulae.setExpression(module, "Visualization.Spurious",    Visualization.Spurious);
	Formulae.setExpression(module, "Visualization.Key",         Visualization.Key);
	Formulae.setExpression(module, "Visualization.CodeBlock",   Visualization.CodeBlock);
	
	Formulae.setExpression(module, "Visualization.FontSize",          Visualization.FontSize);
	Formulae.setExpression(module, "Visualization.FontSizeIncrement", Visualization.FontSizeIncrement);
	Formulae.setExpression(module, "Visualization.FontName",          Visualization.FontName);
	
	Formulae.setExpression(module, "Visualization.Infix", Visualization.Infix);
	
	Formulae.setExpression(module, "Visualization.CreateRectangle", Visualization.CreateRectangle);
	
	// functions
	[
		[ "SetColor",             2, 2 ],
		[ "SetBold",              1, 3 ],
		[ "SetItalic",            1, 3 ],
		[ "SetFontSize",          2, 2 ],
		[ "SetFontSizeIncrement", 2, 2 ],
		[ "SetFontName",          2, 2 ],
		[ "CreateInfix",          2, 2 ]
	].forEach(row => Formulae.setExpression(module, "Visualization." + row[0], {
		clazz:        Expression.Function,
		getTag:       () => "Visualization." + row[0],
		getMnemonic:  () => Visualization.messages["mnemonic" + row[0]],
		getName:      () => Visualization.messages["name" + row[0]],
		getChildName: index => Visualization.messages["children" + row[0]][index],
		min:          row[1],
		max:          row[2]
	}));
	
	// superscript
	Formulae.setExpression(module, "Visualization.Superscript", {
		clazz:   Expression.Superscript,
		getTag:  () => "Visualization.Superscript",
		getName: () => Visualization.messages.nameSuperscript
	});
	
	// subscript
	Formulae.setExpression(module, "Visualization.Subscript", {
		clazz:   Expression.Subscript,
		getTag:  () => "Visualization.Subscript",
		getName: () => Visualization.messages.nameSubscript
	});
	
	// literal symbols
	
	[
		[ "HorizontalEllipsis",        "⋯" ],
		[ "VerticalEllipsis",          "⋮" ],
		[ "UpRightDiagonalEllipsis",   "⋰" ],
		[ "DownRightDiagonalEllipsis", "⋱" ]
	].forEach(row => Formulae.setExpression(module, "Visualization." + row[0], {
		clazz:      Expression.Literal,
		getTag:     () => "Visualization." + row[0],
		getLiteral: () => row[1],
		getName:    () => Visualization.messages["name" + row[0]]
	}));
	
	// infix operations
	
	[
		[ "PlusMinus",               "±" ],
		[ "MinusPlus",               "∓" ],
		[ "Congruent",               "≡" ],
		[ "NotCongruent",            "≢" ],
		[ "FigureCongruent",         "≅" ],
		[ "NotFigureCongruent",      "≆" ],
		[ "ApproximatelyEquals",     "≈" ],
		[ "NotApproximatelyEquals",  "≉" ],
		[ "AsymptoticallyEquals",    "≃" ],
		[ "NotAsymptoticallyEquals", "≄" ],
		[ "Proportional",            "∼" ],
		[ "NotProportional",         "≁" ],
	].forEach(row => Formulae.setExpression(module, "Visualization." + row[0], {
		clazz:       Expression.Infix,
		getTag:      () => "Visualization." + row[0],
		getOperator: () => row[1],
		getName:     () => Visualization.messages["name" + row[0]],
		min: 2, max: 2
	}));
};

