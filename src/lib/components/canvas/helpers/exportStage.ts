import Konva from 'konva';

const blurAmount = 32;

export function exportStage({
	layer,
	stage,
	container
}: {
	layer: Konva.Layer;
	stage: Konva.Stage;
	container: string;
}) {
	const clonedLayer = layer.clone();

	// Change stroke colors to white in the cloned layer
	clonedLayer.find('Line').forEach((line) => {
		if (line instanceof Konva.Line) {
			line.stroke('white');
			line.strokeWidth(line.strokeWidth() + blurAmount);
		}
	});

	// Create an off-screen stage with the same size as the original stage
	const stageForExport = new Konva.Stage({
		container,
		width: stage.width(),
		height: stage.height(),
		visible: true // make it off-screen
	});

	// Create a background for the off-screen stage
	const background = new Konva.Rect({
		x: 0,
		y: 0,
		width: stageForExport.width(),
		height: stageForExport.height(),
		fill: 'black'
	});

	// Create a new layer for background
	const backgroundLayer = new Konva.Layer();
	backgroundLayer.add(background);
	stageForExport.add(backgroundLayer);

	// Add the cloned layer to the off-screen stage
	stageForExport.add(clonedLayer);

	stageForExport.draw();

	clonedLayer.filters([Konva.Filters.Blur]);
	clonedLayer.blurRadius(blurAmount);

	const layerBox = clonedLayer.getClientRect();
	clonedLayer.cache({
		x: layerBox.x - layerBox.width / 2,
		y: layerBox.y - layerBox.height / 2,
		width: layerBox.width * 2,
		height: layerBox.height * 2
	});

	// Export the off-screen stage
	const dataURL = stageForExport.toDataURL({
		mimeType: 'image/png',
		quality: 1.0
	});

	stageForExport.destroy();

	// Download the exported image
	downloadURI(dataURL, 'image.png');
}

function downloadURI(uri: string, name: string) {
	var link = document.createElement('a');
	link.download = name;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
