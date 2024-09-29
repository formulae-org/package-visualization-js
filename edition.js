/*
Fōrmulæ visualization package. Module for edition.
Copyright (C) 2015-2023 Laurence R. Ugalde

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
			s = prompt(Visualization.messages["EnterNumber"], s);
		}
		while (s != null && s == "")
		
		if (s == null) return;

		Formulae.sExpression.set("Name", s);

		Formulae.sHandler.prepareDisplay();
		Formulae.sHandler.display();
		Formulae.setSelected(Formulae.sHandler, Formulae.sExpression, false);
	}
};

Visualization.setEditions = function() {
	Formulae.addEdition(Visualization.messages["pathVisualization"], null, Visualization.messages["leafCrossedOut"],      () => Expression.wrapperEdition("Visualization.CrossedOut"));
	Formulae.addEdition(Visualization.messages["pathVisualization"], null, Visualization.messages["leafMetrics"],         () => Expression.wrapperEdition("Visualization.Metrics"));
	Formulae.addEdition(Visualization.messages["pathVisualization"], null, Visualization.messages["leafCreateRectangle"], () => Expression.multipleEdition("Visualization.CreateRectangle", 4, 0));
	Formulae.addEdition(Visualization.messages["pathVisualization"], null, Visualization.messages["leafSelected"],        () => Expression.wrapperEdition("Visualization.Selected"));
	Formulae.addEdition(Visualization.messages["pathVisualization"], null, Visualization.messages["leafParentheses"],     () => Expression.wrapperEdition("Visualization.Parentheses"));
	Formulae.addEdition(Visualization.messages["pathVisualization"], null, Visualization.messages["leafSpurious"],        () => Expression.wrapperEdition("Visualization.Spurious"));
	Formulae.addEdition(Visualization.messages["pathVisualization"], null, Visualization.messages["leafKey"],             () => Expression.wrapperEdition("Visualization.Key"));
	
	Formulae.addEdition(Visualization.messages["pathVisualization"], null, "Horizontal array",                            () => Expression.binaryEdition  ("Visualization.HorizontalArray", false));
	Formulae.addEdition(Visualization.messages["pathVisualization"], null, "Vertical array",                              () => Expression.binaryEdition  ("Visualization.VerticalArray", false));
	
	Formulae.addEdition(Visualization.messages["pathVisualization"], null, Visualization.messages["leafColor"],             Visualization.editionColor);
	Formulae.addEdition(Visualization.messages["pathVisualization"], null, Visualization.messages["leafBold"],              Visualization.editionBold);
	Formulae.addEdition(Visualization.messages["pathVisualization"], null, Visualization.messages["leafItalic"],            Visualization.editionItalic);
	Formulae.addEdition(Visualization.messages["pathVisualization"], null, Visualization.messages["leafFontSize"],          Visualization.editionFontSize);
	Formulae.addEdition(Visualization.messages["pathVisualization"], null, Visualization.messages["leafFontSizeIncrement"], Visualization.editionFontSizeIncrement);
	Formulae.addEdition(Visualization.messages["pathVisualization"], null, Visualization.messages["leafFontName"],          Visualization.editionFontName);
	
	Formulae.addEdition(Visualization.messages["pathReflection"], null, Visualization.messages["leafSetColor"],             () => Expression.binaryEdition ("Visualization.SetColor",             true));
	Formulae.addEdition(Visualization.messages["pathReflection"], null, Visualization.messages["leafSetBold"],              () => Expression.wrapperEdition("Visualization.SetBold"));
	Formulae.addEdition(Visualization.messages["pathReflection"], null, Visualization.messages["leafSetItalic"],            () => Expression.wrapperEdition("Visualization.SetItalic"));
	Formulae.addEdition(Visualization.messages["pathReflection"], null, Visualization.messages["leafSetFontSize"],          () => Expression.binaryEdition ("Visualization.SetFontSize",          true));
	Formulae.addEdition(Visualization.messages["pathReflection"], null, Visualization.messages["leafSetFontSizeIncrement"], () => Expression.binaryEdition ("Visualization.SetFontSizeIncrement", true));
	Formulae.addEdition(Visualization.messages["pathReflection"], null, Visualization.messages["leafSetFontName"],          () => Expression.binaryEdition ("Visualization.SetFontName",          true));
};

Visualization.setActions = function() {
	Formulae.addAction("Visualization.Color",             Visualization.actionColor);
	Formulae.addAction("Visualization.Bold",              Visualization.actionBold);
	Formulae.addAction("Visualization.Italic",            Visualization.actionItalic);
	Formulae.addAction("Visualization.FontSize",          Visualization.actionFontSize);
	Formulae.addAction("Visualization.FontSizeIncrement", Visualization.actionFontSizeIncrement);
	Formulae.addAction("Visualization.FontName",          Visualization.actionFontName);
};
