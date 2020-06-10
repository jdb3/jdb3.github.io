const navbarinfo = <nav class="navbar navbar-expand-lg navbar-dark bg-dark" style='margin: 15px'>
<a class="navbar-brand" href="index.html">Joseph Bero</a>
<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
  <span class="navbar-toggler-icon"></span>
</button>

<div class="collapse navbar-collapse" id="navbarSupportedContent">
  <ul class="navbar-nav mr-auto">
    <li class="nav-item active">
      <a class="nav-link" href="experience.html">Experience <span class="sr-only">(current)</span></a>
    </li>
    <li class="nav-item active">
      <a class="nav-link" href="publication.html">Publications <span class="sr-only">(current)</span></a>
    </li>
    
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Personal Projects
      </a>
      <div class="dropdown-menu" aria-labelledby="navbarDropdown">
        <a class="dropdown-item" href="grimreaper.html">Flu/Pneumonia in the US</a>
        <a class="dropdown-item" href="covid19.html">COVID-19 Updates</a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" href="comingsoon.html">In Progress</a>
      </div>
    </li>
  </ul>
</div>
</nav>;

console.log(navbarinfo);