
package JobTrackPro.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping(value = "/", produces = "text/html")
    public String home() {

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <title>JobTrackPro Backend</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background: #f4f7fb;
                            text-align: center;
                            padding: 60px 20px;
                            color: #172033;
                        }
                        .container {
                            background: white;
                            max-width: 550px;
                            margin: auto;
                            padding: 35px;
                            border-radius: 12px;
                            box-shadow: 0 4px 15px #00000012;
                        }
                        h1 { color: #2563eb; }
                        .status { color: green; font-weight: bold; }
                        a {
                            display: block;
                            margin: 15px;
                            color: #2563eb;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>JobTrackPro</h1>
                        <h2>REST API Backend</h2>
                        <p class="status">Backend is running successfully!</p>
                        <p>Built with Java, Spring Boot and PostgreSQL.</p>
                        <hr>
                        <h3>Available API Endpoints</h3>
                        <a href="/api/job-applications">
                            View All Job Applications
                        </a>
                        <a href="/api/job-applications/stats">
                            View Application Statistics
                        </a>
                    </div>
                </body>
                </html>
                """;
    }
}
