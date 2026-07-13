/*
Fōrmulæ visualization package. Module for edition.
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

Visualization.editionColor = function() {
	Formulae.Forms.colorSelection(0.0, 0.0, 0.0, 1.0, (r, g, b, o) => {
		let newExpression = Formulae.createExpression("Visualization.Color");
		newExpression.set("Red",   r);
		newExpression.set("Green", g);
		newExpression.set("Blue",  b);
		newExpression.set("Alpha", o);
		
		Formulae.sExpression.replaceBy(newExpression);
		newExpression.addChild(Formulae.sExpression);
		
		Formulae.sHandler.prepareDisplay();
		Formulae.sHandler.display();
		Formulae.setSelected(Formulae.sHandler, newExpression, false);
	});
};

Visualization.actionColor = {
	isAvailableNow: () => Formulae.sHandler.type != Formulae.ROW_OUTPUT,
	getDescription: () => Visualization.messages["actionColor"],
	doAction: () => {
		Formulae.Forms.colorSelection(
			Formulae.sExpression.get("Red"),
			Formulae.sExpression.get("Green"),
			Formulae.sExpression.get("Blue"),
			Formulae.sExpression.get("Alpha"),
			(r, g, b, o) => {
				Formulae.sExpression.set("Red",   r);
				Formulae.sExpression.set("Green", g);
				Formulae.sExpression.set("Blue",  b);
				Formulae.sExpression.set("Alpha", o);
				
				Formulae.sHandler.prepareDisplay();
				Formulae.sHandler.display();
				Formulae.setSelected(Formulae.sHandler, Formulae.sExpression, false);
			}
		);
	}
};

Visualization.boldItalicSelection = function(value, set, f) {
	if (Visualization.boldItalicForm === undefined) {
		let table = document.createElement("table");
		table.innerHTML =
`
<tr><td colspan=2>Set value
<tr><td><td><input type='radio' name='radio' value='tt'>Set bold
<tr><td><td><input type='radio' name='radio' value='ft'>Clear bold
<tr><td colspan=2>Flip value
<tr><td><td><input type='radio' name='radio' value='tf'>Flip bold
<tr><td><td><input type='radio' name='radio' value='ff'>No change
<tr><td colspan=2><button type="button">Ok</button>
`;

		Visualization.boldItalicForm = table;
	}
	
	let table = Visualization.boldItalicForm;
	let tt = table.childNodes[1].childNodes[1].childNodes[1].childNodes[0];
	let ft = table.childNodes[1].childNodes[2].childNodes[1].childNodes[0];
	let tf = table.childNodes[1].childNodes[4].childNodes[1].childNodes[0];
	let ff = table.childNodes[1].childNodes[5].childNodes[1].childNodes[0];
	let ok = table.childNodes[1].childNodes[6].childNodes[0];
	
	if (value) {
		if (set) tt.checked = true; else ft.checked = true;
	}
	else {
		if (set) tf.checked = true; else ff.checked = true;
	}
	
	ok.onclick = () => {
		Formulae.resetModal();
		let v, s;
		if (tt.checked) { v = true;  s = true;  }
		if (ft.checked) { v = false; s = true;  }
		if (tf.checked) { v = true;  s = false; }
		if (ff.checked) { v = false; s = false; }
		f(v, s);
	};
	
	Formulae.setModal(table);
};

Visualization.editionBold = function() {
	Visualization.boldItalicSelection(
		true,
		true,
		(v, s) => {
			let newExpression = Formulae.createExpression("Visualization.Bold");
			newExpression.set("Value", v);
			newExpression.set("Set", s);
			
			Formulae.sExpression.replaceBy(newExpression);
			newExpression.addChild(Formulae.sExpression);
			
			Formulae.sHandler.prepareDisplay();
			Formulae.sHandler.display();
			Formulae.setSelected(Formulae.sHandler, newExpression, false);
		}
	);
};

Visualization.actionBold = {
	isAvailableNow: () => Formulae.sHandler.type != Formulae.ROW_OUTPUT,
	getDescription: () => Visualization.messages["actionBold"],
	doAction: () => {
		Visualization.boldItalicSelection(
			Formulae.sExpression.get("Value"),
			Formulae.sExpression.get("Set"),
			(v, s) => {
				Formulae.sExpression.set("Value", v);
				Formulae.sExpression.set("Set", s);
				
				Formulae.sHandler.prepareDisplay();
				Formulae.sHandler.display();
				Formulae.setSelected(Formulae.sHandler, Formulae.sExpression, false);
			}
		);
	}
};

Visualization.editionItalic = function() {
	Visualization.boldItalicSelection(
		true,
		true,
		(v, s) => {
			let newExpression = Formulae.createExpression("Visualization.Italic");
			newExpression.set("Value", v);
			newExpression.set("Set", s);
			
			Formulae.sExpression.replaceBy(newExpression);
			newExpression.addChild(Formulae.sExpression);
			
			Formulae.sHandler.prepareDisplay();
			Formulae.sHandler.display();
			Formulae.setSelected(Formulae.sHandler, newExpression, false);
		}
	);
};

Visualization.actionItalic = {
	isAvailableNow: () => Formulae.sHandler.type != Formulae.ROW_OUTPUT,
	getDescription: () => Visualization.messages["actionItalic"],
	doAction: () => {
		Visualization.boldItalicSelection(
			Formulae.sExpression.get("Value"),
			Formulae.sExpression.get("Set"),
			(v, s) => {
				Formulae.sExpression.set("Value", v);
				Formulae.sExpression.set("Set", s);
				
				Formulae.sHandler.prepareDisplay();
				Formulae.sHandler.display();
				Formulae.setSelected(Formulae.sHandler, Formulae.sExpression, false);
			}
		);
	}
};

Visualization.editionFontSize = function() {
	Formulae.Forms.integerInRangeSelection(
		Visualization.messages["messageFontSize"],
		Visualization.messages["messageSizeFontSize"],
		6,
		-1,
		Formulae.fontSize,
		size => {
			let newExpression = Formulae.createExpression("Visualization.FontSize");
			newExpression.set("Size", size);
			
			Formulae.sExpression.replaceBy(newExpression);
			newExpression.addChild(Formulae.sExpression);
			
			Formulae.sHandler.prepareDisplay();
			Formulae.sHandler.display();
			Formulae.setSelected(Formulae.sHandler, newExpression, false);
		}
	);
};

Visualization.actionFontSize = {
	isAvailableNow: () => Formulae.sHandler.type != Formulae.ROW_OUTPUT,
	getDescription: () => Visualization.messages["actionFontSize"],
	doAction: () => {
		Formulae.Forms.integerInRangeSelection(
			Visualization.messages["messageFontSize"],
			Visualization.messages["messageSizeFontSize"],
			6,
			-1,
			Formulae.sExpression.get("Size"),
			newSize => {
				Formulae.sExpression.set("Size", newSize);
				
				Formulae.sHandler.prepareDisplay();
				Formulae.sHandler.display();
				Formulae.setSelected(Formulae.sHandler, Formulae.sExpression, false);
			}
		);
	}
};

Visualization.editionFontSizeIncrement = function() {
	Formulae.Forms.integerInRangeSelection(
		Visualization.messages["messageFontSizeIncrement"],
		Visualization.messages["messageIncrementFontSizeIncrement"],
		6,
		-1,
		Formulae.fontSize,
		increment => {
			let newExpression = Formulae.createExpression("Visualization.FontSizeIncrement");
			newExpression.set("Increment", increment);
			
			Formulae.sExpression.replaceBy(newExpression);
			newExpression.addChild(Formulae.sExpression);
			
			Formulae.sHandler.prepareDisplay();
			Formulae.sHandler.display();
			Formulae.setSelected(Formulae.sHandler, newExpression, false);
		}
	);
};

Visualization.actionFontSizeIncrement = {
	isAvailableNow: () => Formulae.sHandler.type != Formulae.ROW_OUTPUT,
	getDescription: () => Visualization.messages["actionFontSizeIncrement"],
	doAction: () => {
		Formulae.Forms.integerInRangeSelection(
			Visualization.messages["messageFontSize"],
			Visualization.messages["messageIncrementFontSizeIncrement"],
			6,
			-1,
			Formulae.sExpression.get("Increment"),
			increment => {
				Formulae.sExpression.set("Increment", increment);
				
				Formulae.sHandler.prepareDisplay();
				Formulae.sHandler.display();
				Formulae.setSelected(Formulae.sHandler, Formulae.sExpression, false);
			}
		);
	}
};

Visualization.editionFontName = function() {
	let s = "";
	
	do {
		s = prompt(Visualization.messages["messageFontName"], s);
	}
	while (s != null && s == "")
	
	if (s == null) return;
	
	let newExpression = Formulae.createExpression("Visualization.FontName");
	newExpression.set("Name", s);
	
	Formulae.sExpression.replaceBy(newExpression);
	newExpression.addChild(Formulae.sExpression);
	
	Formulae.sHandler.prepareDisplay();
	Formulae.sHandler.display();
	Formulae.setSelected(Formulae.sHandler, newExpression, false);
};

Visualization.actionFontName = {
	isAvailableNow: () => Formulae.sHandler.type != Formulae.ROW_OUTPUT,
	getDescription: () => Visualization.messages["actionFontName"],
	doAction: () => {
		let s = Formulae.sExpression.get("Name");
		
		do {
			s = prompt(Visualization.messages["messageFontName"], s);
		}
		while (s != null && s == "")
		
		if (s == null) return;
		
		Formulae.sExpression.set("Name", s);
		
		Formulae.sHandler.prepareDisplay();
		Formulae.sHandler.display();
		Formulae.setSelected(Formulae.sHandler, Formulae.sExpression, false);
	}
};

Visualization.codeBlockSelection = function(value, f) {
	if (Visualization.codeBlockForm === undefined) {
		let table = document.createElement("table");
		table.innerHTML =
`
<tr><td>Code block:
<tr><td><textarea name="ta" cols=100 rows=10></textarea>
<tr><td><button type="button">Ok</button>
`;
		
		Visualization.codeBlockForm = table;
	}
	
	let table = Visualization.codeBlockForm;
	
	let c = table.childNodes[1].childNodes[1].childNodes[0].childNodes[0];
	let ok = table.childNodes[1].childNodes[2].childNodes[0].childNodes[0];
	
	c.value = value;
	
	ok.onclick = () => {
		Formulae.resetModal();
		f(c.value);
	};
	
	Formulae.setModal(table);
};

Visualization.editionCodeBlock = function() {
	Visualization.codeBlockSelection(
		"",
		value => {
			let newExpression = Formulae.createExpression("Visualization.CodeBlock");
			newExpression.set("Value", value);
			
			Formulae.sExpression.replaceBy(newExpression);
			
			Formulae.sHandler.prepareDisplay();
			Formulae.sHandler.display();
			Formulae.setSelected(Formulae.sHandler, newExpression, false);
		}
	);
};

Visualization.actionCodeBlock = {
	isAvailableNow: () => Formulae.sHandler.type != Formulae.ROW_OUTPUT,
	getDescription: () => Visualization.messages["actionCodeBlock"],
	doAction: () => {
		Visualization.codeBlockSelection(
			Formulae.sExpression.get("Value"),
			value => {
				Formulae.sExpression.set("Value", value);
				
				Formulae.sHandler.prepareDisplay();
				Formulae.sHandler.display();
				Formulae.setSelected(Formulae.sHandler, Formulae.sExpression, false);
			}
		);
	}
};

Visualization.creationInfix = function() {
	let operator = prompt(Visualization.messages.enterInfixOperator);
	if (operator === null) return;
	
	let newExpression = Formulae.createExpression("Visualization.Infix");
	newExpression.set("Operator", operator);
	
	Formulae.sExpression.replaceBy(newExpression);
	newExpression.addChild(Formulae.sExpression);
	newExpression.addChild(Formulae.createExpression("Null"));
	
	Formulae.sHandler.prepareDisplay();
	Formulae.sHandler.display();
	Formulae.setSelected(Formulae.sHandler, newExpression.children[1], false);
};

Visualization.actionInfix = {
	isAvailableNow: () => Formulae.sHandler.type != Formulae.ROW_OUTPUT,
	getDescription: () => Visualization.messages.actionEditInfixOperator,
	doAction: () => {
		let operator = Formulae.sExpression.get("Operator");
		operator = prompt(Visualization.messages.enterInfixOperator, operator);
		
		if (operator == null) return;
		
		Formulae.sExpression.set("Operator", operator);
		
		Formulae.sHandler.prepareDisplay();
		Formulae.sHandler.display();
		Formulae.setSelected(Formulae.sHandler, Formulae.sExpression, false);
	}
};

Visualization.setEditions = function() {

	Formulae.addWrapperEditions(Visualization.messages, "Visualization", "Visualization", [ "CrossedOut", "Metrics" ]);

	// Invisible renders with no visible difference from (literally nothing of) its child, so no icon can preview it
	Formulae.addEdition(Visualization.messages["pathVisualization"], Visualization.messages["leafInvisible"], Visualization.messages["leafInvisible"], () => Expression.wrapperEdition("Visualization.Invisible"));

	Formulae.addEdition(Visualization.messages["pathVisualization"], Formulae.icon("Visualization.CreateRectangle", 4), Visualization.messages["leafCreateRectangle"], () => Expression.multipleEdition("Visualization.CreateRectangle", 4, 0));

	Formulae.addWrapperEditions(Visualization.messages, "Visualization", "Visualization", [ "Selected", "Parentheses" ]);

	// Spurious renders with no visible difference from its child, so no icon can preview it
	Formulae.addEdition(Visualization.messages["pathVisualization"], Visualization.messages["leafSpurious"], Visualization.messages["leafSpurious"], () => Expression.wrapperEdition("Visualization.Spurious"));

	Formulae.addWrapperEditions(Visualization.messages, "Visualization", "Visualization", [ "Key" ]);

	Formulae.addBinaryEdition(Visualization.messages, "Visualization", "Superscript", "Visualization.Superscript");
	Formulae.addBinaryEdition(Visualization.messages, "Visualization", "Subscript",   "Visualization.Subscript");

	// literal symbols — simple glyphs are plain text, like arithmetic's π/e/∞

	[
		[ "HorizontalEllipsis",        "⋯" ],
		[ "VerticalEllipsis",          "⋮" ],
		[ "UpRightDiagonalEllipsis",   "⋰" ],
		[ "DownRightDiagonalEllipsis", "⋱" ]
	].forEach(row => Formulae.addEdition(
		Visualization.messages["pathVisualization"],
		row[1],
		Visualization.messages["leaf" + row[0]],
		() => Expression.replacingEdition("Visualization." + row[0])
	));

	// infix operations — real Expression.Infix instances, so the icon shows the actual operator glyph

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
	].forEach(row => Formulae.addBinaryEdition(Visualization.messages, "Visualization", row[0], "Visualization." + row[0]));

	// Infix: operator is prompted (unknown until entered), like Number/Symbol
	Formulae.addEdition(Visualization.messages["pathVisualization"], Visualization.messages["leafInfix"], Visualization.messages["leafInfix"], Visualization.creationInfix);
	// CreateInfix: selection naturally belongs among the operands (child1), not the prompted-string Operator slot (child0) — bugfix, see DONE.md
	Formulae.addBinaryEdition(Visualization.messages, "Visualization", "CreateInfix", "Visualization.CreateInfix", false);

	Formulae.addBinaryEdition(Visualization.messages, "Visualization", "HorizontalArray", "Visualization.HorizontalArray");
	Formulae.addBinaryEdition(Visualization.messages, "Visualization", "VerticalArray",   "Visualization.VerticalArray");

	// Prompted creators/dialogs with multiple or unbounded possible outcomes: no single icon could represent them, like Number/Time
	Formulae.addEdition(Visualization.messages["pathVisualization"], Visualization.messages["leafColor"],             Visualization.messages["leafColor"],             Visualization.editionColor);
	Formulae.addEdition(Visualization.messages["pathVisualization"], Visualization.messages["leafBold"],              Visualization.messages["leafBold"],              Visualization.editionBold);
	Formulae.addEdition(Visualization.messages["pathVisualization"], Visualization.messages["leafItalic"],            Visualization.messages["leafItalic"],            Visualization.editionItalic);

	// Code has no prompt and applies its style directly (no paragraph-context trick needed), so its icon shows a genuine bold-monospace preview
	Formulae.addEdition(Visualization.messages["pathVisualization"], '<expression tag="Visualization.Code"><expression tag="Visualization.Selected"><expression tag="String.Text" Value="x"/></expression></expression>', Visualization.messages["leafCode"], () => Expression.wrapperEdition("Visualization.Code"));

	Formulae.addEdition(Visualization.messages["pathVisualization"], Visualization.messages["leafFontSize"],          Visualization.messages["leafFontSize"],          Visualization.editionFontSize);
	Formulae.addEdition(Visualization.messages["pathVisualization"], Visualization.messages["leafFontSizeIncrement"], Visualization.messages["leafFontSizeIncrement"], Visualization.editionFontSizeIncrement);
	Formulae.addEdition(Visualization.messages["pathVisualization"], Visualization.messages["leafFontName"],          Visualization.messages["leafFontName"],          Visualization.editionFontName);
	Formulae.addEdition(Visualization.messages["pathVisualization"], Visualization.messages["leafCodeBlock"],         Visualization.messages["leafCodeBlock"],         Visualization.editionCodeBlock);

	// SetColor/SetFontSize/SetFontSizeIncrement/SetFontName: selection belongs in the "Expression" (target) slot, not the "value" slot — bugfix, see DONE.md
	Formulae.addBinaryEdition(Visualization.messages, "Reflection", "SetColor", "Visualization.SetColor");
	Formulae.addWrapperEditions(Visualization.messages, "Reflection", "Visualization", [ "SetBold", "SetItalic" ]);
	Formulae.addBinaryEdition(Visualization.messages, "Reflection", "SetFontSize",          "Visualization.SetFontSize");
	Formulae.addBinaryEdition(Visualization.messages, "Reflection", "SetFontSizeIncrement", "Visualization.SetFontSizeIncrement");
	Formulae.addBinaryEdition(Visualization.messages, "Reflection", "SetFontName",          "Visualization.SetFontName");
};

Visualization.setActions = function() {
	Formulae.addAction("Visualization.Color",             Visualization.actionColor);
	Formulae.addAction("Visualization.Bold",              Visualization.actionBold);
	Formulae.addAction("Visualization.Italic",            Visualization.actionItalic);
	Formulae.addAction("Visualization.FontSize",          Visualization.actionFontSize);
	Formulae.addAction("Visualization.FontSizeIncrement", Visualization.actionFontSizeIncrement);
	Formulae.addAction("Visualization.FontName",          Visualization.actionFontName);
	Formulae.addAction("Visualization.CodeBlock",         Visualization.actionCodeBlock);
	Formulae.addAction("Visualization.Infix",             Visualization.actionInfix);
};

