import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';


function ThreeScene({ images }) {

  console.log(images);

  const mountRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const keysPressed = {};

  useEffect(() => {
    const scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();
  
    // Création du renderer avec antialias et activation de la correction gamma pour le rendu
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding; // Correction gamma pour le rendu
  
    // Chargement des textures avec correction gamma et application de THREE.LinearMipmapLinearFilter
    const textures = images.map(image => {
      const texture = loader.load(image, (tex) => {
        tex.encoding = THREE.sRGBEncoding; // Appliquer l'encodage sRGB pour chaque texture
        tex.minFilter = THREE.LinearMipmapLinearFilter; // Appliquer le filtre de minification
      });
      return texture;
    });
  
    // Assurez-vous d'avoir généré des mipmaps pour les textures où vous utilisez ce filtre.
    textures.forEach(texture => {
      texture.generateMipmaps = true; // Assure que les mipmaps sont générés pour les textures
    });

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);




    mountRef.current.appendChild(renderer.domElement);


    let nombrePetitsCubes = 10; // Nombre de petits cubes
    const espacementEntreCubes = 50; // Espacement entre les cubes
    const petitCubeDepth = 50; // Profondeur d'un petit cube
    const petitCubeWidth = espacementEntreCubes;
    const cubeHeight = 50;

    // Calcul de la profondeur totale nécessaire
    const profondeurTotale = (petitCubeDepth * nombrePetitsCubes) + ((espacementEntreCubes) * (nombrePetitsCubes - 1)) + (2 * espacementEntreCubes) + 30

    const largeurTotale = (petitCubeWidth * nombrePetitsCubes) + ((espacementEntreCubes) * (nombrePetitsCubes - 1)) + (2 * espacementEntreCubes);
    const cubeWidth = Math.max(largeurTotale, 10); // Assurez-vous que la largeur est suffisante


    // Assurez-vous que le grand cube a une profondeur suffisante pour contenir tous les petits cubes
    const cubeDepth = Math.max(profondeurTotale, 10); // Choisissez une valeur minimale appropriée




    // const cubeDepth = 100;


    camera.position.set(0, 0, (cubeDepth / 2) - 15);


    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xff5555, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ color: 0x55ff55, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ color: 0x5555ff, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ color: 0xffff55, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ color: 0x55ffff, side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ color: 0xff55ff, side: THREE.BackSide })
    ];
    const geometry = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);
    const cube = new THREE.Mesh(geometry, materials);


    scene.add(cube);
    // Petit cube

    const petitCubeHeight = cubeHeight;
    // const petitCubeDepth = 5;

    // const petitCubePosX = 0;
    const petitCubePosY = 0;

    const smallCubeGeometry = new THREE.BoxGeometry(petitCubeWidth, petitCubeHeight, petitCubeDepth);


    // ...

    const petitsCubesPositions = [];

    // Définition de deux ensembles de matériaux
    const smallCubeMaterialsPair = [
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Rouge
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Vert
      new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Bleu
      new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Jaune
      new THREE.MeshBasicMaterial({ color: 0x00ffff }), // Cyan
      new THREE.MeshBasicMaterial({ color: 0xff00ff })  // Magenta
    ];

    const smallCubeMaterialsImpair = [
      new THREE.MeshBasicMaterial({ color: 0xa52a2a }), // Brun
      new THREE.MeshBasicMaterial({ color: 0x8a2be2 }), // Bleu violet
      new THREE.MeshBasicMaterial({ color: 0xa0522d }), // Sienna
      new THREE.MeshBasicMaterial({ color: 0xcd5c5c }), // Rouge indien
      new THREE.MeshBasicMaterial({ color: 0x2e8b57 }), // Mer vert
      new THREE.MeshBasicMaterial({ color: 0xff69b4 }), // Rose vif
    ];


    // Fonction pour diviser les textures en sous-tableaux de 4 éléments
    function chunkTextures(textures, chunkSize) {
      let result = [];
      for (let i = 0; i < textures.length; i += chunkSize) {
        result.push(textures.slice(i, i + chunkSize));
      }
      return result;
    }

    // Diviser les textures en sous-tableaux de 4 éléments
    const chunkedTextures = chunkTextures(textures, 4);

    // Boucle pour créer les petits cubes
    for (let i = 0; i < nombrePetitsCubes; i++) {
      let cubesDansRangée = nombrePetitsCubes;
      if (nombrePetitsCubes > 2 && i % 2 === 0) {
        cubesDansRangée += 1; // Ajoute un cube supplémentaire pour les rangées paires si nombrePetitsCubes > 2
      }
      for (let j = 0; j < cubesDansRangée; j++) {
        let petitCubePosX;
        let petitCubePosZ;

        // Position de chaque petit cube
        if (nombrePetitsCubes <= 2) {
          // S'il y a 2 petits cubes ou moins, ajouter un espace avant le premier cube
          petitCubePosX = -(cubeWidth / 2) + petitCubeWidth / 2 + espacementEntreCubes + (j * (petitCubeWidth + espacementEntreCubes));
        } else {
          // Pour plus de 2 petits cubes, la position habituelle
          petitCubePosX = (i % 2 === 0) ? -(cubeWidth / 2) + petitCubeWidth / 2 + (j * (petitCubeWidth + espacementEntreCubes))
            : -(cubeWidth / 2) + petitCubeWidth / 2 + espacementEntreCubes + (j * (petitCubeWidth + espacementEntreCubes));
        }

        petitCubePosZ = -(cubeDepth / 2) + petitCubeDepth / 2 + espacementEntreCubes + (i * (petitCubeDepth + espacementEntreCubes));

        // Choix du matériau en fonction de la parité de la rangée
        const materials = i % 2 === 0 ? smallCubeMaterialsPair : smallCubeMaterialsImpair;

        // Créer et positionner le petit cube
        const smallCube = new THREE.Mesh(smallCubeGeometry, materials);
        smallCube.position.set(petitCubePosX, petitCubePosY, petitCubePosZ);
        scene.add(smallCube);

        const edges = new THREE.EdgesGeometry(smallCubeGeometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000 })); // Mettez la couleur souhaitée pour les arêtes
        line.position.copy(smallCube.position); // Positionner les lignes au même endroit que le cube
        scene.add(line);

        // À l'intérieur de la boucle for où vous créez les petits cubes
        const smallCubeCenter = new THREE.Vector3(); // Centre du petit cube
        smallCubeCenter.set(petitCubePosX, petitCubePosY, petitCubePosZ);

        const miniCubeWidth = 40; // Largeur du mini-cube
        const miniCubeHeight = 40; // Hauteur du mini-cube
        const miniCubeDepth = 2; // Profondeur du mini-cube
        const miniCubeGeometry = new THREE.BoxGeometry(miniCubeWidth, miniCubeHeight, miniCubeDepth);

        // Définition des matériaux pour chaque face du mini-cube


        // Position des mini-cubes sur chaque face du petit cube
        const positions = [
          // Exclure Haut et Bas ici
          new THREE.Vector3(smallCubeCenter.x + petitCubeWidth / 2, smallCubeCenter.y, smallCubeCenter.z), // Droite
          new THREE.Vector3(smallCubeCenter.x - petitCubeWidth / 2, smallCubeCenter.y, smallCubeCenter.z), // Gauche
          new THREE.Vector3(smallCubeCenter.x, smallCubeCenter.y, smallCubeCenter.z + petitCubeDepth / 2), // Avant
          new THREE.Vector3(smallCubeCenter.x, smallCubeCenter.y, smallCubeCenter.z - petitCubeDepth / 2)  // Arrière
        ];

        // Création et ajout des mini-cubes avec des couleurs différentes pour chaque face
        // À l'intérieur de la boucle for où vous créez et positionnez les mini-cubes
        // Matériaux pour les mini-cubes
        const faceParalleleMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Bleu pour la face parallèle
        const autreFaceMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Jaune pour les autres faces

        // Obtenir le sous-tableau de textures pour le cube actuel
        const currentTextures = chunkedTextures[(i * nombrePetitsCubes + j) % chunkedTextures.length];

        console.log(currentTextures);

        positions.forEach((pos, index) => {
          // Créer un tableau de matériaux pour chaque mini-cube
          let miniCubeMaterials = [
            autreFaceMaterial,
            autreFaceMaterial,
            autreFaceMaterial,
            autreFaceMaterial,
            new THREE.MeshBasicMaterial({ map: currentTextures[index % currentTextures.length] }),
            autreFaceMaterial,
          ];


          // Création du mini-cube avec le tableau de matériaux ajusté
          const miniCube = new THREE.Mesh(miniCubeGeometry, miniCubeMaterials);
          miniCube.position.set(pos.x, pos.y, pos.z);

          // Ajuster l'orientation du mini-cube si nécessaire
          switch (index) {
            case 0: // Droite
              miniCube.rotation.y = Math.PI / 2; // Rotation de 90 degrés autour de l'axe Y
              break;
            case 1: // Gauche
              miniCube.rotation.y = -Math.PI / 2; // Rotation de -90 degrés autour de l'axe Y
              break;
            case 2: // Avant
              // Pas de rotation nécessaire, la face avant est déjà alignée
              break;
            case 3: // Arrière
              miniCube.rotation.y = Math.PI; // Rotation de 180 degrés autour de l'axe Y
              break;
          }
          scene.add(miniCube);

          // Ajouter des bordures noires autour de chaque mini-cube
          const edgesGeometry = new THREE.EdgesGeometry(miniCubeGeometry);
          const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Noir
          const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
          edges.position.copy(miniCube.position);
          edges.rotation.copy(miniCube.rotation); // Aligner les bordures avec le mini-cube
          scene.add(edges);
        });

        petitsCubesPositions.push({ x: petitCubePosX, y: petitCubePosY, z: petitCubePosZ });
      }
    }







    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    const handlePointerLockChange = () => {
      if (document.pointerLockElement === mountRef.current ||
        document.mozPointerLockElement === mountRef.current ||
        document.webkitPointerLockElement === mountRef.current) {
        console.log("Pointer Lock activé");
      } else {
        console.log("Pointer Lock désactivé");
      }
    };

    const handleMouseMove = (event) => {
      const deltaX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      const deltaY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
      const mouseSensitivity = 0.01;

      mouse.current.x -= deltaX * mouseSensitivity;
      mouse.current.y -= deltaY * mouseSensitivity;
      mouse.current.y = THREE.MathUtils.clamp(mouse.current.y, -Math.PI / 2 + 0.1, Math.PI / 2 - 0.1);

      const euler = new THREE.Euler(mouse.current.y, mouse.current.x, 0, 'YXZ');
      camera.quaternion.setFromEuler(euler);
    };

    function estDansUnDesPetitsCubes(position, petitsCubes, petitCubeWidth, petitCubeHeight, petitCubeDepth) {
      const demiLargeur = petitCubeWidth / 2;
      const demiHauteur = petitCubeHeight / 2;
      const demiProfondeur = petitCubeDepth / 2;

      return petitsCubes.some(petitCube => {
        return position.x > petitCube.x - demiLargeur && position.x < petitCube.x + demiLargeur &&
          position.y > petitCube.y - demiHauteur && position.y < petitCube.y + demiHauteur &&
          position.z > petitCube.z - demiProfondeur && position.z < petitCube.z + demiProfondeur;
      });
    }






    function updateCameraPosition() {
      const speed = 1;
      let direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      direction.y = 0; // Ignorer la composante verticale
      direction.normalize();

      const upVector = new THREE.Vector3(0, 1, 0);
      let lateralMove = new THREE.Vector3().crossVectors(upVector, direction).normalize().multiplyScalar(speed);
      let newPosition = camera.position.clone();

      if (keysPressed['ArrowUp']) {
        newPosition.add(direction.multiplyScalar(speed));
      }
      if (keysPressed['ArrowDown']) {
        newPosition.add(direction.multiplyScalar(-speed));
      }
      if (keysPressed['ArrowLeft']) {
        newPosition.add(keysPressed['ArrowDown'] ? lateralMove.multiplyScalar(-1) : lateralMove);
      }
      if (keysPressed['ArrowRight']) {
        newPosition.add(keysPressed['ArrowDown'] ? lateralMove : lateralMove.multiplyScalar(-1));
      }

      // Empêcher de traverser le petit cube
      if (!estDansUnDesPetitsCubes(newPosition, petitsCubesPositions, petitCubeWidth, petitCubeHeight, petitCubeDepth)) {
        const margin = 1; // La marge entre la caméra et le mur
        newPosition.x = THREE.MathUtils.clamp(newPosition.x, -cubeWidth / 2 + margin, cubeWidth / 2 - margin);
        newPosition.z = THREE.MathUtils.clamp(newPosition.z, -cubeDepth / 2 + margin, cubeDepth / 2 - margin);
      } else {
        // Si on est dans le petit cube, on bloque le mouvement
        newPosition.copy(camera.position);
      }

      camera.position.copy(newPosition);
    }





    mountRef.current.addEventListener('click', () => {
      mountRef.current.requestPointerLock = mountRef.current.requestPointerLock ||
        mountRef.current.mozRequestPointerLock ||
        mountRef.current.webkitRequestPointerLock;
      mountRef.current.requestPointerLock();
    });

    document.addEventListener('pointerlockchange', handlePointerLockChange, false);
    document.addEventListener('mozpointerlockchange', handlePointerLockChange, false);
    document.addEventListener('webkitpointerlockchange', handlePointerLockChange, false);

    window.addEventListener('keydown', updateCameraPosition);
    window.addEventListener('mousemove', handleMouseMove);

    const KeyDown = (event) => {
      keysPressed[event.key] = true;
    };

    const KeyUp = (event) => {
      delete keysPressed[event.key];
    };

    window.addEventListener('keydown', KeyDown);
    window.addEventListener('keyup', KeyUp);

    const animate = () => {
      requestAnimationFrame(animate);
      updateCameraPosition();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', updateCameraPosition);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mozpointerlockchange', handlePointerLockChange);
      document.removeEventListener('webkitpointerlockchange', handlePointerLockChange);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [images]);

  return <div ref={mountRef} />;
}

export default ThreeScene;








