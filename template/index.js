<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flight Management</title>
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #000; /* Light background by default */
            color: #fff; /* Black text by default */
            padding: 20px;
            transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition for dark mode */
        }

        body.white-mode {
            background-color: #fff; /* Dark background in dark mode */
            color: #000; /* White text in dark mode */
        }

        pre {
            border: 1px solid #ddd;
            padding: 10px;
            margin-bottom: 20px;
            background-color: #222; /* Dark background for pre */
            color: #fff; /* White text for pre */
            overflow: auto;
        }

        pre.white-mode {
            border: 1px solid #000;
            background-color: #ddd; /* White background for pre */
            color: #000; /* White text for pre */
        }

        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 4px;
        }

        /* Dark mode button */
        #darkModeButton {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <pre id="departuresContent"></pre>
    <pre id="arrivalsContent"></pre>

    <button id="darkModeButton" onclick="toggleDarkMode()">Toggle Dark Mode</button>

    <script>
        $(document).ready(function () {
            // Function to update content
            function updateContent(on_del = false) {
                $.ajax({
                    url: 'Departure.yaml',
                    cache: false,
                    success: function (data) {
                        $('#departuresContent').text(data);
                        createButtons('departuresContent');
                    }
                });

                $.ajax({
                    url: 'Arrival.yaml',
                    cache: false,
                    success: function (data) {
                        $('#arrivalsContent').text(data);
                        createButtons('arrivalsContent');
                    }
                });

                if (on_del == false) {
                    // Recursive call for continuous updates
                    setTimeout(updateContent, 500); // Update every 500 milliseconds
                }
            }

            // Function to create delete buttons
            function createButtons(containerId) {
                const container = $(`#${containerId}`);
                const lines = container.text().split('\n');

                container.empty(); // Clear existing content before updating

                lines.forEach(line => {
                    if (line.includes('Callsign: ')) {
                        const callsign = line.split('Callsign: ')[1]; // Removed trim

                        const button = $('<button>Delete</button>');

                        button.on('click', function () {
                            // Send an AJAX request to the Flask app with the callsign
                            $.ajax({
                                type: 'POST',
                                url: '/',
                                data: { callsign: callsign },
                                success: function(response) {
                                    // Handle success if needed
                                    console.log(response);
                                },
                                error: function(error) {
                                    // Handle error if needed
                                    console.error(error);
                                }
                            });
                        });

                        container.append(line + ' ').append(button).append('<br>');
                    } else {
                        container.append(line + '<br>');
                    }
                });
            }

            // Initial update
            updateContent();
        });

        // Dark mode toggle function
        function toggleDarkMode() {
            $('body').toggleClass('white-mode');
            $('pre').toggleClass('white-mode');
        }
    </script>
</body>
</html>